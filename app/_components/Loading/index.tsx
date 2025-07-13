'use client';

import { useEffect, useRef } from 'react';

export default function Loading() {
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loadingRef.current) {
      loadingRef.current.style.transition = 'opacity 0.3s ease';

      // わずかな遅延を入れることで、トランジションが正しく適用されるようにする
      const timer = setTimeout(() => {
        if (loadingRef.current) {
          loadingRef.current.style.opacity = '0';
        }
      }, 100);

      const handleTransitionEnd = () => {
        if (loadingRef.current) {
          loadingRef.current.style.display = 'none';
        }
      };

      loadingRef.current.addEventListener('transitionend', handleTransitionEnd);

      return () => {
        clearTimeout(timer);
        loadingRef.current?.removeEventListener('transitionend', handleTransitionEnd);
      };
    }
  }, []);

  return (
    <div className="loading" ref={loadingRef}>
      <div className="loading-border">
        <div className="loading-core"></div>
      </div>
    </div>
  );
}
