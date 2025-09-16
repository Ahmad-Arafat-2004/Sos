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
  const [loaded, setLoaded] = useState(false);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [sel, setSel] = useState({ x: 0, y: 0, w: 100, h: 100 });
  const dragging = useRef<string | null>(null);
  const dragStart = useRef({ mx: 0, my: 0, sx: 0, sy: 0, sw: 0, sh: 0 });

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  const onImgLoad = () => {
    if (!imgRef.current || !containerRef.current) return;
    const img = imgRef.current;
    const rect = img.getBoundingClientRect();
    setImgSize({ w: rect.width, h: rect.height });
    // default selection: center square respecting aspect
    const w = rect.width * 0.6;
    const h = aspect ? w / aspect : w;
    const x = (rect.width - w) / 2;
    const y = (rect.height - h) / 2;
    setSel({ x, y, w, h });
    setLoaded(true);
  };

  const clientToImg = (clientX: number, clientY: number) => {
    if (!containerRef.current || !imgRef.current) return { x: 0, y: 0 };
    const crect = containerRef.current.getBoundingClientRect();
    const x = clientX - crect.left;
    const y = clientY - crect.top;
    return { x, y };
  };

  const onPointerDown = (e: React.PointerEvent, mode: string) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture(e.pointerId);
    dragging.current = mode;
    const p = clientToImg(e.clientX, e.clientY);
    dragStart.current = { mx: p.x, my: p.y, sx: sel.x, sy: sel.y, sw: sel.w, sh: sel.h } as any;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const p = clientToImg(e.clientX, e.clientY);
    const dpx = p.x - dragStart.current.mx;
    const dpy = p.y - dragStart.current.my;
    const mode = dragging.current;
    let nx = dragStart.current.sx;
    let ny = dragStart.current.sy;
    let nw = dragStart.current.sw;
    let nh = dragStart.current.sh;

    if (mode === "move") {
      nx = dragStart.current.sx + dpx;
      ny = dragStart.current.sy + dpy;
      nx = clamp(nx, 0, imgSize.w - nw);
      ny = clamp(ny, 0, imgSize.h - nh);
    } else if (mode === "nw") {
      // top-left corner resize
      nw = dragStart.current.sw - dpx;
      nh = aspect ? nw / aspect : dragStart.current.sh - dpy;
      nx = dragStart.current.sx + dpx;
      ny = dragStart.current.sy + (dragStart.current.sh - nh);
      if (nw < 20) nw = 20;
      if (nh < 20) nh = 20;
      nx = clamp(nx, 0, imgSize.w - nw);
      ny = clamp(ny, 0, imgSize.h - nh);
    } else if (mode === "se") {
      // bottom-right
      nw = dragStart.current.sw + dpx;
      nh = aspect ? nw / aspect : dragStart.current.sh + dpy;
      if (nw < 20) nw = 20;
      if (nh < 20) nh = 20;
      nw = clamp(nw, 20, imgSize.w - dragStart.current.sx);
      nh = clamp(nh, 20, imgSize.h - dragStart.current.sy);
    }

    setSel({ x: nx, y: ny, w: nw, h: nh });
  };

  const onPointerUp = (e: React.PointerEvent) => {
    try {
      (e.target as Element).releasePointerCapture(e.pointerId);
    } catch {}
    dragging.current = null;
  };

  const applyCrop = () => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    // compute ratio between natural and displayed
    const naturalW = img.naturalWidth;
    const naturalH = img.naturalHeight;
    const ratioX = naturalW / imgSize.w;
    const ratioY = naturalH / imgSize.h;
    const sx = Math.round(sel.x * ratioX);
    const sy = Math.round(sel.y * ratioY);
    const sw = Math.round(sel.w * ratioX);
    const sh = Math.round(sel.h * ratioY);
    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    onApply(dataUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative bg-white rounded p-4 max-w-3xl w-full mx-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Crop image</h3>
          <div className="space-x-2">
            <button className="px-3 py-1 border rounded" onClick={onCancel}>
              Cancel
            </button>
            <button className="px-3 py-1 bg-olive-600 text-white rounded" onClick={applyCrop}>
              Apply
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative bg-gray-100 w-full flex items-center justify-center"
          style={{ height: 480 }}
        >
          <img
            ref={imgRef}
            src={src}
            alt="to-crop"
            onLoad={onImgLoad}
            style={{ maxWidth: "100%", maxHeight: "100%", display: "block" }}
          />

          {loaded && (
            <>
              <div
                style={{
                  position: "absolute",
                  left: sel.x,
                  top: sel.y,
                  width: sel.w,
                  height: sel.h,
                  border: "2px solid #fff",
                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.4)",
                  cursor: "move",
                }}
                onPointerDown={(e) => onPointerDown(e, "move")}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
              />

              {/* corner handles */}
              <div
                style={{ position: "absolute", left: sel.x - 8, top: sel.y - 8, width: 16, height: 16, background: "white", borderRadius: 4, cursor: "nwse-resize" }}
                onPointerDown={(e) => onPointerDown(e, "nw")}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
              />
              <div
                style={{ position: "absolute", left: sel.x + sel.w - 8, top: sel.y + sel.h - 8, width: 16, height: 16, background: "white", borderRadius: 4, cursor: "nwse-resize" }}
                onPointerDown={(e) => onPointerDown(e, "se")}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
