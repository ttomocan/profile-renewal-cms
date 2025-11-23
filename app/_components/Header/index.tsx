'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MenuNav from '../MenuNav';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // パスからページクラスを取得
  const getPageClass = () => {
    if (pathname === '/') return '--top';
    const slug = pathname.split('/')[1];
    return slug ? `--${slug}` : '';
  };

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

  return (
    <header className={`l-header ${getPageClass()}`}>
      <h1 className="l-header__logo">
        <Link href="/">
          <Image src="/img/common/h_logo.png" alt="ともきゃんスタイルのロゴ" width={400} height={33} sizes="(max-width: 767px) 60vw, 400px" />
        </Link>
      </h1>
      <div className={`l-header__menuBtn ${isMenuOpen ? 'is-open' : 'is-close'}`}>
        <button className="l-header__menuBtn-button" aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'} onClick={toggleMenu} aria-expanded={isMenuOpen}>
          <span className="top"></span>
          <span className="middle"></span>
          <span className="bottom"></span>
        </button>
      </div>
      <div className={`l-header__link ${isMenuOpen ? 'menu-open' : ''}`}>
        <MenuNav onLinkClick={() => setIsMenuOpen(false)} />
      </div>
    </header>
  );
}
