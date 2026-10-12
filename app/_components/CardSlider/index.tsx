'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import Splide from '@splidejs/splide';
import '@splidejs/splide/css/core';

type Props = {
  children: ReactNode;
  kind: 'results' | 'diary';
  label: string;
  previous: string;
  next: string;
};

// SSR exposes all cards. Splide enhances only the existing mobile carousel;
// its partial destruction restores the desktop grid on breakpoint changes.
export default function CardSlider({ children, kind, label, previous, next }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const id = `card-slider-${useId().replace(/:/g, '')}`;

  useEffect(() => {
    if (!root.current) return;
    const element = root.current;
    const focusableNodes = 'a, button, textarea, input, select, iframe, [tabindex], [contenteditable]';
    // Splide 4.1.4 restores slide attributes on destroy, but not the tabindex
    // it applied to child links. Remember the author's values before mounting.
    const focusTargets = Array.from(element.querySelector('.splide__list')?.querySelectorAll<HTMLElement>(focusableNodes) ?? [])
      .map(node => ({ node, tabIndex: node.getAttribute('tabindex') }));
    const restore = () => {
      for (const { node, tabIndex } of focusTargets) {
        if (tabIndex === null) node.removeAttribute('tabindex');
        else node.setAttribute('tabindex', tabIndex);
      }
      element.setAttribute('role', 'group');
      element.setAttribute('aria-label', label);
      element.setAttribute('tabindex', '-1');
    };
    const protectFocus = () => {
      const focused = document.activeElement;
      if (focused && Array.from(element.querySelectorAll('.splide__slide[aria-hidden="true"]')).some(slide => slide.contains(focused))) {
        const button = element.querySelector<HTMLButtonElement>('.splide__arrow:not(:disabled)');
        (button ?? element).focus({ preventScroll: true });
      }
    };
    const slider = new Splide(root.current, {
      label,
      type: 'slide',
      rewind: false,
      perPage: 1,
      perMove: 1,
      gap: '24px',
      padding: '10%',
      pagination: false,
      autoplay: false,
      keyboard: false,
      live: true,
      role: 'group',
      speed: 400,
      reducedMotion: { speed: 0, rewindSpeed: 0, autoplay: false },
      mediaQuery: 'min',
      breakpoints: { 768: { destroy: true } },
      focusableNodes,
      i18n: {
        prev: previous, next, first: '最初のカードへ', last: '最後のカードへ',
        slideX: '%s番目のカードへ', pageX: '%sページ目へ',
        play: '自動再生を開始', pause: '自動再生を停止',
        carousel: 'スライダー', select: '表示するカードを選択',
        slide: 'カード', slideLabel: '%s枚目 / 全%s枚',
      },
    });
    // Extensions mount again after partial breakpoint destruction. Initial
    // hidden slides do not emit 'hidden', so check focus on 'mounted' too.
    slider.mount({
      FocusSafety: instance => ({
        mount: () => { instance.on('mounted moved updated resized hidden', protectFocus); },
        destroy: restore,
      }),
    });
    return () => { slider.destroy(true); restore(); };
  }, [children, label, previous, next]);

  return (
    <div ref={root} id={id} className={`splide card-slider ${kind}-slider-wrapper`} role="group" aria-label={label} tabIndex={-1}>
      <div className="splide__arrows">
        <button type="button" className={`splide__arrow splide__arrow--prev ${kind}-slider-nav ${kind}-slider-nav--prev`} aria-label={previous} disabled>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <button type="button" className={`splide__arrow splide__arrow--next ${kind}-slider-nav ${kind}-slider-nav--next`} aria-label={next}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
      <div className="splide__track">
        <ul className={`splide__list ${kind}-grid`}>{children}</ul>
      </div>
    </div>
  );
}
