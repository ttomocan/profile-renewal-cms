'use client';

import { useRef, useState, useEffect } from 'react';
import ResultCard from '@/components/ResultCard';
import type { ResultItem } from '@/types/results';

interface ResultsSliderProps {
  results: ResultItem[];
}

export default function ResultsSlider({ results }: ResultsSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // スクロール位置をチェックして、ボタンの有効/無効を更新
  const checkScrollPosition = () => {
    if (!sliderRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;

    // 左にスクロール可能か（少し余裕を持たせる）
    setCanScrollLeft(scrollLeft > 5);

    // 右にスクロール可能か（少し余裕を持たせる）
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  // 初回マウント時とリサイズ時にチェック
  useEffect(() => {
    checkScrollPosition();

    const handleResize = () => {
      checkScrollPosition();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // スクロールイベントでボタンの状態を更新
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.addEventListener('scroll', checkScrollPosition);
    return () => slider.removeEventListener('scroll', checkScrollPosition);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;

    const scrollAmount = sliderRef.current.offsetWidth * 0.85; // カード1枚分の幅
    const currentScroll = sliderRef.current.scrollLeft;
    const targetScroll = direction === 'left'
      ? currentScroll - scrollAmount
      : currentScroll + scrollAmount;

    sliderRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  return (
    <div className="results-slider-wrapper">
      <div className="results-grid" ref={sliderRef}>
        {results.slice(0, 6).map((result, index) => (
          <ResultCard
            key={`${result.id}-${index}`}
            result={result}
            priority={index === 0}
          />
        ))}
      </div>

      {/* スライダーナビゲーションボタン（SP表示のみ） */}
      <button
        className={`results-slider-nav results-slider-nav--prev ${!canScrollLeft ? 'is-disabled' : ''}`}
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        aria-label="前の実績を表示"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button
        className={`results-slider-nav results-slider-nav--next ${!canScrollRight ? 'is-disabled' : ''}`}
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        aria-label="次の実績を表示"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
}
