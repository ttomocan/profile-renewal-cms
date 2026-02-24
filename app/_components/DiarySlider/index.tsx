'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Blog } from '@/app/_libs/microcms';
import { formatDate, formatDateISO } from '@/app/_libs/utils';

interface DiarySliderProps {
  blog: Blog[];
}

export default function DiarySlider({ blog }: DiarySliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = () => {
    if (!sliderRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScrollPosition();

    const handleResize = () => {
      checkScrollPosition();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.addEventListener('scroll', checkScrollPosition);
    return () => slider.removeEventListener('scroll', checkScrollPosition);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;

    const scrollAmount = sliderRef.current.offsetWidth * 0.85;
    const currentScroll = sliderRef.current.scrollLeft;
    const targetScroll =
      direction === 'left'
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;

    sliderRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  if (blog.length === 0) return null;

  return (
    <div className="diary-slider-wrapper">
      <div className="diary-grid" ref={sliderRef}>
        {blog.map((article) => (
          <article key={article.id} className="diary-card">
            <Link
              href={`/diary/${article.id}/`}
              className="diary-card__link"
              aria-label={`記事「${article.title}」を読む`}
            >
              <div className="diary-card__image">
                {article.thumbnail ? (
                  <Image
                    src={article.thumbnail.url}
                    alt={`${article.title}のサムネイル画像`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="diary-card__image-img"
                    loading="lazy"
                  />
                ) : (
                  <Image
                    src="/img/common/ogp.png"
                    alt="デフォルトのサムネイル画像"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="diary-card__image-img"
                    loading="lazy"
                  />
                )}
                <div className="diary-card__overlay"></div>
              </div>

              <div className="diary-card__content">
                <div className="diary-card__meta">
                  <span className="diary-card__category">
                    {article.category.name}
                  </span>
                  <time
                    dateTime={formatDateISO(
                      article.publishedAt ?? article.createdAt
                    )}
                    className="diary-card__date"
                  >
                    {formatDate(article.publishedAt ?? article.createdAt)}
                  </time>
                </div>

                <h3 className="diary-card__title">{article.title}</h3>

                {article.description && (
                  <p className="diary-card__description">
                    {article.description}
                  </p>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>

      <button
        className={`diary-slider-nav diary-slider-nav--prev ${!canScrollLeft ? 'is-disabled' : ''}`}
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        aria-label="前の記事を表示"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button
        className={`diary-slider-nav diary-slider-nav--next ${!canScrollRight ? 'is-disabled' : ''}`}
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        aria-label="次の記事を表示"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
}
