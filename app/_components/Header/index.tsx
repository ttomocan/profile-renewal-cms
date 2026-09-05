'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MenuNav from '../MenuNav';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    if (window.matchMedia('(max-width: 1040px)').matches) {
      menuButtonRef.current?.focus();
    }
    setIsMenuOpen(false);
  }, []);

  const toggleMenu = () => {
    if (isMenuOpen) closeMenu();
    else setIsMenuOpen(true);
  };

  // パスからページクラスを取得（/index, /index/ もトップページとして扱う）
  const getPageClass = () => {
    if (pathname === '/' || /^\/index\/?$/.test(pathname)) return '--top';
    const slug = pathname.split('/')[1];
    return slug ? `--${slug}` : '';
  };

  // スクロールイベントでヘッダーの固定表示を制御
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop > 200) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // 初回実行
    handleScroll();

    // スクロールイベントリスナーを追加
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 全画面メニューの表示中は、背景の読み上げ・操作・スクロールを止める。
  useEffect(() => {
    if (!isMenuOpen) return;
    const header = headerRef.current;
    const menu = menuRef.current;
    const button = menuButtonRef.current;
    if (!header || !menu || !button) return;

    const mobileQuery = window.matchMedia('(max-width: 1040px)');
    if (!mobileQuery.matches) return;

    const background = Array.from(header.parentElement?.children ?? [])
      .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== header && !element.matches('script, style, link'))
      .map((element) => ({ element, inert: element.inert }));
    background.forEach(({ element }) => { element.inert = true; });
    document.body.classList.add('header-no-scroll');
    button.focus();

    const getControls = () => [button, ...Array.from(menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex="0"]'))
      .filter((element) => element.getClientRects().length > 0)];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
      }
      if (event.key === 'Tab') {
        const controls = getControls();
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    const handleFocus = (event: FocusEvent) => {
      if (event.target !== button && !menu.contains(event.target as Node)) button.focus();
    };
    const handleBreakpoint = () => {
      if (!mobileQuery.matches) {
        // PCではボタンが非表示になるので、ナビゲーションへフォーカスを渡す。
        if (document.activeElement === button) menu.querySelector<HTMLElement>('nav a')?.focus();
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocus);
    mobileQuery.addEventListener('change', handleBreakpoint);
    return () => {
      background.forEach(({ element, inert }) => { element.inert = inert; });
      document.body.classList.remove('header-no-scroll');
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocus);
      mobileQuery.removeEventListener('change', handleBreakpoint);
    };
  }, [isMenuOpen, closeMenu]);

  const pageClass = getPageClass();
  const isTopPage = pageClass === '--top';

  return (
    <>
      {isTopPage && (
        <a className="skip-link" href="#main" onClick={(event) => {
          const main = document.getElementById('main');
          if (!main) return;
          event.preventDefault();
          event.stopPropagation();
          main.focus({ preventScroll: true });
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}>
          本文へ移動
        </a>
      )}
      <header ref={headerRef} className={`l-header ${pageClass} ${isScrolled ? 'scroll' : ''}`}>
        <div className="l-header__logo" inert={isMenuOpen}>
          <Link href="/">
            <Image src="/img/common/h_logo.png" alt="ともきゃんスタイルのロゴ" width={400} height={33} sizes="(max-width: 767px) 60vw, 400px" />
          </Link>
        </div>
        <div className={`l-header__menuBtn ${isMenuOpen ? 'is-open' : 'is-close'}`}>
          <button ref={menuButtonRef} className="l-header__menuBtn-button" aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'} onClick={toggleMenu} aria-expanded={isMenuOpen} aria-controls="global-menu">
            <span className="top"></span>
            <span className="middle"></span>
            <span className="bottom"></span>
          </button>
        </div>
        <div ref={menuRef} id="global-menu" className={`l-header__link ${isMenuOpen ? 'menu-open' : ''}`}>
          <MenuNav onLinkClick={closeMenu} />
        </div>
      </header>
      {isScrolled && !isTopPage && <div className="l-header-spacer" />}
    </>
  );
}
