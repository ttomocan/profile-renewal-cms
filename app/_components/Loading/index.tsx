'use client';

import { useEffect, useRef, useState } from 'react';

export default function Loading() {
  const loadingRef = useRef<HTMLDivElement>(null);
  const [isRemoved, setIsRemoved] = useState(false);

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
        // トランジション完了後、DOMから要素を削除
        setIsRemoved(true);
      };

      loadingElement.addEventListener('transitionend', handleTransitionEnd);

      return () => {
        clearTimeout(timer);
        loadingElement?.removeEventListener('transitionend', handleTransitionEnd);
      };
    }
  }, []);

  // ロード完了後は何も表示しない（DOMから削除）
  if (isRemoved) {
    return null;
  }

  return (
    <div className="loading" ref={loadingRef}>
      <div className="loading-border">
        <div className="loading-core"></div>
      </div>
    </div>
  );
}
