'use client';

import { useEffect, useRef } from 'react';

export default function Loading() {
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadingElement = loadingRef.current;

    if (loadingElement) {
      loadingElement.style.transition = 'opacity 0.3s ease';

      // わずかな遅延を入れることで、トランジションが正しく適用されるようにする
      const timer = setTimeout(() => {
        if (loadingElement) {
          loadingElement.style.opacity = '0';
        }
      }, 100);

      const handleTransitionEnd = () => {
        if (loadingElement) {
          loadingElement.style.display = 'none';
        }
      };

      loadingElement.addEventListener('transitionend', handleTransitionEnd);

      return () => {
        clearTimeout(timer);
        loadingElement?.removeEventListener('transitionend', handleTransitionEnd);
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
