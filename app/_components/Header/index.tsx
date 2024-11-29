'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MenuNav from '../MenuNav';

export default function Header() {
  const toggleMenuBtnState = () => {
    const menuBtn = document.querySelector('.l-header__menuBtn');
    if (menuBtn) {
      if (menuBtn.classList.contains('open')) {
        menuBtn.classList.remove('open');
        menuBtn.classList.add('close');
      } else {
        menuBtn.classList.remove('close');
        menuBtn.classList.add('open');
      }
    }
  };

  const open = () => {
    // メニューの開閉状態を切り替え
    document.body.classList.toggle('no-scroll');
    document.querySelector('.l-header__link')?.classList.toggle('menu-open');

    // メニューボタンの状態を切り替え
    toggleMenuBtnState();
  };

  useEffect(() => {
    const links = document.querySelectorAll('.l-header__link a');

    const closeMenu = () => {
      document.querySelector('.l-header__link')?.classList.remove('menu-open');
      document.body.classList.remove('no-scroll');
      toggleMenuBtnState();
    };

    links.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // クリーンアップ処理
    return () => {
      links.forEach((link) => {
        link.removeEventListener('click', closeMenu);
      });
    };
  }, []);

  return (
    <header className="l-header">
      <h1 className="l-header__logo">
        <Link href="/">
          <Image src="/img/common/h_logo.png" alt="ともきゃんスタイルのロゴ" width={400} height={33} priority sizes="(max-width: 767px) 60vw, 400px" />
        </Link>
      </h1>
      <div className="l-header__menuBtn">
        <button className="l-header__menuBtn-button" aria-label="メニューを開く" onClick={open}>
          <span className="top"></span>
          <span className="middle"></span>
          <span className="bottom"></span>
        </button>
      </div>
      <div className="l-header__link">
        <MenuNav />
      </div>
    </header>
  );
}
