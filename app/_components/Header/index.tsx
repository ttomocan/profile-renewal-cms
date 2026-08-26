'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MenuNav from '../MenuNav';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen((isOpen) => !isOpen);
  };

  const closeMenu = useCallback((restoreFocus = false) => {
    setIsMenuOpen(false);
    if (restoreFocus) {
      requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  }, []);

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

  // メニューが開いているときは背景スクロールを無効化
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('header-no-scroll');
    } else {
      document.body.classList.remove('header-no-scroll');
    }

    // クリーンアップ関数
    return () => {
      document.body.classList.remove('header-no-scroll');
    };
  }, [isMenuOpen]);

  useEffect(() => {
    closeMenu(false);
  }, [closeMenu, pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeMenu, isMenuOpen]);

  const pageClass = getPageClass();
  const isTopPage = pageClass === '--top';

  return (
    <>
      <header className={`l-header ${pageClass} ${isScrolled ? 'scroll' : ''}`}>
        <div className="l-header__logo">
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
        <div id="global-menu" className={`l-header__link ${isMenuOpen ? 'menu-open' : ''}`}>
          <MenuNav onLinkClick={() => closeMenu(false)} />
        </div>
      </header>
      {isScrolled && !isTopPage && <div className="l-header-spacer" />}
    </>
  );
}
