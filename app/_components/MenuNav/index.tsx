'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type MenuNavProps = {
  onLinkClick?: () => void;
};

export default function MenuNav({ onLinkClick }: MenuNavProps) {
  const pathname = usePathname();

  const isCurrent = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const handleClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <>
      <ul className="l-header__blog">
        <li className="l-header__blog__item">
          <Link href="https://www.newagevoice.com/" target="_blank" className="c-link-external" onClick={handleClick}>
            ともきゃんのボイトレ生活
          </Link>
        </li>
        <li className="l-header__blog__item">
          <Link href="https://www.blogdesign-mania.com/" target="_blank" className="c-link-external" onClick={handleClick}>
            ブログデザインマニア
          </Link>
        </li>
      </ul>
      <nav className="l-header__navigation" role="navigation" aria-label="グローバルナビゲーション">
        <ul className="l-navigation">
          <li className="l-navigation__item">
            <Link href="/" className={`l-navigation__item ${isCurrent('/') ? 'current' : ''}`} onClick={handleClick}>
              Top
            </Link>
          </li>
          <li className="l-navigation__item">
            <Link href="/about/" className={`l-navigation__item ${isCurrent('/about') ? 'current' : ''}`} onClick={handleClick}>
              About
            </Link>
          </li>
          <li className="l-navigation__item">
            <Link href="/skill/" className={`l-navigation__item ${isCurrent('/skill') ? 'current' : ''}`} onClick={handleClick}>
              Skill
            </Link>
          </li>
          <li className="l-navigation__item">
            <Link href="/diary/" className={`l-navigation__item ${isCurrent('/diary') ? 'current' : ''}`} onClick={handleClick}>
              Diary
            </Link>
          </li>
          <li className="l-navigation__item">
            <Link href="/contact/" className={`l-navigation__item ${isCurrent('/contact') ? 'current' : ''}`} onClick={handleClick}>
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      <div className="l-header__sns">
        <Link href="https://x.com/t_tomocan" className="l-header__sns__item --x" target="_blank" onClick={handleClick}>
          <Image src="/img/common/icon_x.svg" alt="X" width={30} height={30} style={{ width: 'auto', height: '30px' }} />
        </Link>
        <Link href="https://coconala.com/users/1531202" className="l-header__sns__item --coconala" target="_blank" onClick={handleClick}>
          <Image src="/img/common/icon_coconala.svg" alt="coconala" width={40} height={40} style={{ width: 'auto', height: '40px' }} />
        </Link>
      </div>
    </>
  );
}
