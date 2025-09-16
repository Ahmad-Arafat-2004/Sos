import React, { useRef, useState, useEffect } from "react";

interface Props {
  src: string;
  onCancel: () => void;
  onApply: (dataUrl: string) => void;
  aspect?: number; // width/height, optional
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const ImageCropper: React.FC<Props> = ({ src, onCancel, onApply, aspect = 1 }) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [displayBase, setDisplayBase] = useState({ w: 0, h: 0 });
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [sel, setSel] = useState({ x: 0, y: 0, w: 100, h: 100 });
  const [loaded, setLoaded] = useState(false);
  const dragging = useRef<string | null>(null);
  const dragStart = useRef<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [panMode, setPanMode] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  const onImgLoad = () => {
    if (!imgRef.current || !containerRef.current) return;
    const img = imgRef.current;
    const crect = containerRef.current.getBoundingClientRect();
    // compute display base to fit within container
    const ratio = Math.min(crect.width / img.naturalWidth, crect.height / img.naturalHeight, 1);
    const baseW = img.naturalWidth * ratio;
    const baseH = img.naturalHeight * ratio;
    setNatural({ w: img.naturalWidth, h: img.naturalHeight });
    setDisplayBase({ w: baseW, h: baseH });
    setScale(1);
    setPan({ x: 0, y: 0 });
    // default selection center
    const w = baseW * 0.6;
    const h = aspect ? w / aspect : w;
    const x = (crect.width - w) / 2;
    const y = (crect.height - h) / 2;
    setSel({ x, y, w, h });
    setLoaded(true);
  };

  const clientToContainer = (clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const crect = containerRef.current.getBoundingClientRect();
    return { x: clientX - crect.left, y: clientY - crect.top };
  };

  const onPointerDown = (e: React.PointerEvent, mode: string) => {
    e.preventDefault();
    dragging.current = mode;
    const p = clientToContainer(e.clientX, e.clientY);
    dragStart.current = { p, sel: { ...sel }, pan: { ...pan } } as any;
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const p = clientToContainer(e.clientX, e.clientY);
    const dx = p.x - dragStart.current.p.x;
    const dy = p.y - dragStart.current.p.y;
    const mode = dragging.current;
    if (mode === "move") {
      let nx = dragStart.current.sel.x + dx;
      let ny = dragStart.current.sel.y + dy;
      // constrain within container
      const crect = containerRef.current!.getBoundingClientRect();
      nx = clamp(nx, 0, crect.width - sel.w);
      ny = clamp(ny, 0, crect.height - sel.h);
      setSel((s) => ({ ...s, x: nx, y: ny }));
    } else if (mode === "nw") {
      // top-left resize
      let nw = dragStart.current.sel.w - dx;
      let nh = aspect ? nw / aspect : dragStart.current.sel.h - dy;
      let nx = dragStart.current.sel.x + dx;
      let ny = dragStart.current.sel.y + (dragStart.current.sel.h - nh);
      if (nw < 20) nw = 20;
      if (nh < 20) nh = 20;
      const crect = containerRef.current!.getBoundingClientRect();
      nx = clamp(nx, 0, crect.width - nw);
      ny = clamp(ny, 0, crect.height - nh);
      setSel({ x: nx, y: ny, w: nw, h: nh });
    } else if (mode === "se") {
      let nw = dragStart.current.sel.w + dx;
      let nh = aspect ? nw / aspect : dragStart.current.sel.h + dy;
      if (nw < 20) nw = 20;
      if (nh < 20) nh = 20;
      const crect = containerRef.current!.getBoundingClientRect();
      nw = clamp(nw, 20, crect.width - dragStart.current.sel.x);
      nh = clamp(nh, 20, crect.height - dragStart.current.sel.y);
      setSel({ x: dragStart.current.sel.x, y: dragStart.current.sel.y, w: nw, h: nh });
    } else if (mode === "pan") {
      // pan image by adjusting pan offsets
      const newPanX = dragStart.current.pan.x + dx;
      const newPanY = dragStart.current.pan.y + dy;
      // Constrain pan so image always covers container
      const crect = containerRef.current!.getBoundingClientRect();
      const scaledW = displayBase.w * scale;
      const scaledH = displayBase.h * scale;
      const minPanX = Math.min(0, crect.width - scaledW) / 2; // allow centering offsets
      const maxPanX = Math.max(0, (scaledW - crect.width) / 2);
      const minPanY = Math.min(0, crect.height - scaledH) / 2;
      const maxPanY = Math.max(0, (scaledH - crect.height) / 2);
      // use simpler clamp around newPanX/Y
      setPan({ x: clamp(newPanX, -1000, 1000), y: clamp(newPanY, -1000, 1000) });
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {}
    dragging.current = null;
  };

  // compute image display position
  const getImgLayout = () => {
    const crect = containerRef.current?.getBoundingClientRect();
    if (!crect) return { left: 0, top: 0, width: displayBase.w * scale, height: displayBase.h * scale };
    const sw = displayBase.w * scale;
    const sh = displayBase.h * scale;
    const left = (crect.width - sw) / 2 + pan.x;
    const top = (crect.height - sh) / 2 + pan.y;
    return { left, top, width: sw, height: sh };
  };

  // preview generation
  useEffect(() => {
    if (!loaded || !imgRef.current || !containerRef.current) return;
    const img = imgRef.current;
    const crect = containerRef.current.getBoundingClientRect();
    const { left: imgLeft, top: imgTop, width: sw, height: sh } = getImgLayout();
    const sx = Math.round(((sel.x - imgLeft) / sw) * natural.w);
    const sy = Math.round(((sel.y - imgTop) / sh) * natural.h);
    const swN = Math.round((sel.w / sw) * natural.w);
    const shN = Math.round((sel.h / sh) * natural.h);
    if (sx < 0 || sy < 0 || swN <= 0 || shN <= 0) {
      setPreviewUrl(null);
      return;
    }
    const c = document.createElement("canvas");
    const target = 200; // preview size
    c.width = target;
    c.height = Math.round((shN / swN) * target);
    const ctx = c.getContext("2d");
    if (!ctx) return;
    // draw portion from natural image
    ctx.drawImage(img, sx, sy, swN, shN, 0, 0, c.width, c.height);
    const url = c.toDataURL("image/jpeg", 0.9);
    setPreviewUrl(url);
  }, [sel, scale, pan, loaded, natural, displayBase]);

  const applyCrop = () => {
    if (!imgRef.current || !containerRef.current) return;
    const img = imgRef.current;
    const { left: imgLeft, top: imgTop, width: sw, height: sh } = getImgLayout();
    const sx = Math.round(((sel.x - imgLeft) / sw) * natural.w);
    const sy = Math.round(((sel.y - imgTop) / sh) * natural.h);
    const swN = Math.round((sel.w / sw) * natural.w);
    const shN = Math.round((sel.h / sh) * natural.h);
    const canvas = document.createElement("canvas");
    canvas.width = swN;
    canvas.height = shN;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, sx, sy, swN, shN, 0, 0, swN, shN);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    onApply(dataUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative bg-white rounded p-4 max-w-4xl w-full mx-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Crop image</h3>
          <div className="space-x-2 flex items-center">
            <label className="text-sm mr-4">Zoom</label>
            <input type="range" min={1} max={3} step={0.01} value={scale} onChange={(e) => setScale(Number(e.target.value))} />
            <button className="px-3 py-1 border rounded ml-3" onClick={() => setPan({ x: 0, y: 0 })}>Reset Pan</button>
            <button className={`px-3 py-1 border rounded ml-3 ${panMode ? 'bg-gray-200' : ''}`} onClick={() => setPanMode(!panMode)}>{panMode ? 'Pan: On' : 'Pan: Off'}</button>
            <button className="px-3 py-1 border rounded ml-3" onClick={onCancel}>Cancel</button>
            <button className="px-3 py-1 bg-olive-600 text-white rounded ml-2" onClick={applyCrop}>Apply</button>
          </div>
        </div>

        <div className="flex gap-4">
          <div
            ref={containerRef}
            className="relative bg-gray-100 flex items-center justify-center"
            style={{ height: 480, flex: 1 }}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <img
              ref={imgRef}
              src={src}
              alt="to-crop"
              onLoad={onImgLoad}
              style={{ position: 'absolute', left: getImgLayout().left, top: getImgLayout().top, width: getImgLayout().width, height: getImgLayout().height, userSelect: 'none', touchAction: 'none' }}
            />

            {loaded && (
              <>
                <div
                  style={{ position: 'absolute', left: sel.x, top: sel.y, width: sel.w, height: sel.h, border: '2px solid #fff', boxShadow: '0 0 0 9999px rgba(0,0,0,0.4)', cursor: 'move' }}
                  onPointerDown={(e) => onPointerDown(e, 'move')}
                />
                <div style={{ position: 'absolute', left: sel.x - 8, top: sel.y - 8, width: 16, height: 16, background: 'white', borderRadius: 4, cursor: 'nwse-resize' }} onPointerDown={(e) => onPointerDown(e, 'nw')} />
                <div style={{ position: 'absolute', left: sel.x + sel.w - 8, top: sel.y + sel.h - 8, width: 16, height: 16, background: 'white', borderRadius: 4, cursor: 'nwse-resize' }} onPointerDown={(e) => onPointerDown(e, 'se')} />
                {/* pan overlay */}
                {panMode && <div style={{ position: 'absolute', inset: 0, cursor: 'grab' }} onPointerDown={(e) => onPointerDown(e, 'pan')} />}
              </>
            )}
          </div>

          <div style={{ width: 240 }}>
            <div className="mb-2">Preview</div>
            <div className="w-48 h-48 bg-gray-50 rounded overflow-hidden shadow flex items-center justify-center">
              {previewUrl ? <img src={previewUrl} alt="preview" className="w-full h-full object-cover" /> : <div className="text-sm text-gray-400">No preview</div>}
            </div>
            <div className="text-xs text-gray-500 mt-2">This shows how the cropped image will appear inside the product box.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
