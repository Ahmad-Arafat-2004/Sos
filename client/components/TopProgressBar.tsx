import React, { useEffect, useState } from 'react';
import { useLoading } from '../contexts/LoadingContext';

const TopProgressBar: React.FC = () => {
  const { isLoading } = useLoading();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    let timer: any;
    if (isLoading) {
      setVisible(true);
      setWidth(20);
      timer = setInterval(() => {
        setWidth((w) => Math.min(95, w + Math.random() * 10));
      }, 400);
    } else {
      setWidth(100);
      timer = setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 300);
    }

    return () => clearInterval(timer);
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 9999 }}>
      <div
        style={{
          height: '100%',
          background: 'linear-gradient(90deg,#84cc16,#16a34a)',
          width: `${width}%`,
          transition: 'width 250ms linear, opacity 300ms linear',
        }}
      />
    </div>
  );
};

export default TopProgressBar;
