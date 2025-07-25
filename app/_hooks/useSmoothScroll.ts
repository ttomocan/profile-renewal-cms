'use client';

import { useEffect, useCallback } from 'react';

export function useSmoothScroll() {
  const scrollToTarget = useCallback((target: HTMLElement, headerHeight: number = 0) => {
    const position = Math.max(0, target.offsetTop - headerHeight);

    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: position,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo(0, position);
    }
  }, []);

  useEffect(() => {
    const handleClick = (event: Event) => {
      const anchor = (event.target as Element)?.closest('a[href^="#"]') as HTMLAnchorElement;
      if (!anchor || anchor.matches('.l-header__link a')) return;

      event.preventDefault();

      const href = anchor.getAttribute('href');
      const targetSelector = !href || href === '#' ? 'html' : href;
      const target = document.querySelector(targetSelector) as HTMLElement;

      if (!target) return;

      // ヘッダーの高さを動的に取得
      const header = document.querySelector('.l-header') as HTMLElement;
      const headerHeight = header?.offsetHeight || 0;

      scrollToTarget(target, headerHeight);
    };

    // 初期ハッシュ処理
    const handleInitialHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const target = document.querySelector(hash) as HTMLElement;
        if (target) {
          const header = document.querySelector('.l-header') as HTMLElement;
          const headerHeight = header?.offsetHeight || 0;
          scrollToTarget(target, headerHeight);
        }
      }
    };

    document.addEventListener('click', handleClick);

    // ページ読み込み後に初期ハッシュ処理
    setTimeout(handleInitialHash, 100);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [scrollToTarget]);
}
