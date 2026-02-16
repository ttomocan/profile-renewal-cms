'use client';

import { useEffect, useRef } from 'react';

export default function PageTop() {
  const btnRef = useRef<HTMLButtonElement>(null);
  const rafId = useRef(0);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    let ticking = false;

    const update = () => {
      const scrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      // 表示/非表示（240px超でフェードイン）
      btn.classList.toggle('show', scrollY > 240);

      // 進捗率を0〜100でクランプしCSS変数に反映
      const progress =
        maxScroll > 0
          ? Math.min(100, Math.max(0, (scrollY / maxScroll) * 100))
          : 0;
      btn.style.setProperty('--p', `${progress}%`);

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        rafId.current = requestAnimationFrame(update);
        ticking = true;
      }
    };

    const onResize = () => {
      update();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handleClick = () => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <button
      ref={btnRef}
      className="c-backtotop"
      aria-label="ページ上部へ戻る"
      onClick={handleClick}
      type="button"
    />
  );
}
