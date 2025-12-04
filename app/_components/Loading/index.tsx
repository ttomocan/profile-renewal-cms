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
      const fadeTimer = setTimeout(() => {
        if (loadingElement) {
          loadingElement.style.opacity = '0';
        }
      }, 100);

      // transitionendイベントが発火しない場合のフォールバック
      // トランジション時間(0.3s) + 開始遅延(100ms) + バッファ(100ms) = 500ms
      const fallbackTimer = setTimeout(() => {
        setIsRemoved(true);
      }, 500);

      const handleTransitionEnd = (e: TransitionEvent) => {
        // opacityのトランジション完了時のみ処理
        if (e.propertyName === 'opacity') {
          setIsRemoved(true);
        }
      };

      loadingElement.addEventListener('transitionend', handleTransitionEnd);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(fallbackTimer);
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
