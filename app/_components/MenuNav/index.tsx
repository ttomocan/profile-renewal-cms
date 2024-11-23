'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Menu() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const open = () => setOpen(true);
  const close = () => setOpen(false);

  return (
    <div className="l-header__link">
      <ul className="l-header__blog">
        <li className="l-header__blog__item">
          <Link href="https://www.newagevoice.com/" target="_blank" className="c-link-external">
            ともきゃんのボイトレ生活
          </Link>
        </li>
        <li className="l-header__blog__item">
          <Link href="https://www.blogdesign-mania.com/" target="_blank" className="c-link-external">
            ブログデザインマニア
          </Link>
        </li>
      </ul>
      <nav className="l-header__navigation" role="navigation" aria-label="グローバルナビゲーション">
        <ul className="l-navigation">
          <li className="l-navigation__item">
            <a href="/" className="current">
              Top
            </a>
          </li>
          <li className="l-navigation__item">
            <a href="/about/">About</a>
          </li>
          <li className="l-navigation__item">
            <a href="/skill/">Skill</a>
          </li>
          <li className="l-navigation__item">
            <a href="/contact/">Contact</a>
          </li>
        </ul>
      </nav>
      <div className="l-header__sns">
        <a href="https://x.com/t_tomocan" className="l-header__sns__item --x" target="_blank">
          <Image src="/img/common/icon_x.svg" alt="X" width={40} height={41} priority />
        </a>
        <a href="https://coconala.com/users/1531202" className="l-header__sns__item --coconala" target="_blank">
          <Image src="/img/common/icon_coconala.svg" alt="coconala" width={40} height={41} priority />
        </a>
      </div>
    </div>
  );
}
