'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type MenuNavLinkProps = React.ComponentProps<typeof Link> & {
  onLinkClick?: () => void;
};

function MenuNavLink({ onLinkClick, ...props }: MenuNavLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (onLinkClick) onLinkClick();
    if (props.onClick) props.onClick(e);
  };
  return <Link {...props} onClick={handleClick} />;
}

type MenuNavProps = {
  onLinkClick?: () => void;
};

export default function MenuNav({ onLinkClick }: MenuNavProps) {
  const pathname = usePathname();

  const isCurrent = (path: string) => {
    // パスの末尾に'/'がなければ付与
    const normalize = (p: string) => (p.endsWith('/') ? p : p + '/');
    if (path === '/') {
      return pathname === '/';
    }
    return normalize(pathname).startsWith(normalize(path));
  };

  return (
    <>
      <ul className="l-header__blog">
        <li className="l-header__blog__item">
          <MenuNavLink href="https://www.newagevoice.com/" target="_blank" className="c-link-external" rel="noopener noreferrer" onLinkClick={onLinkClick}>
            ともきゃんのボイトレ生活
          </MenuNavLink>
        </li>
        <li className="l-header__blog__item">
          <MenuNavLink href="https://www.blogdesign-mania.com/" target="_blank" className="c-link-external" rel="noopener noreferrer" onLinkClick={onLinkClick}>
            ブログデザインマニア
          </MenuNavLink>
        </li>
      </ul>
      <nav className="l-header__navigation" role="navigation" aria-label="グローバルナビゲーション">
        <ul className="l-navigation">
          <li className="l-navigation__item">
            <MenuNavLink href="/" className={`c-navigation-link${isCurrent('/') ? ' current' : ''}`} onLinkClick={onLinkClick}>
              Top
            </MenuNavLink>
          </li>
          <li className="l-navigation__item">
            <MenuNavLink href="/about/" className={`c-navigation-link${isCurrent('/about') ? ' current' : ''}`} onLinkClick={onLinkClick}>
              About
            </MenuNavLink>
          </li>
          <li className="l-navigation__item">
            <MenuNavLink href="/skill/" className={`c-navigation-link${isCurrent('/skill') ? ' current' : ''}`} onLinkClick={onLinkClick}>
              Skill
            </MenuNavLink>
          </li>
          <li className="l-navigation__item">
            <MenuNavLink href="/diary/" className={`c-navigation-link${isCurrent('/diary') ? ' current' : ''}`} onLinkClick={onLinkClick}>
              Diary
            </MenuNavLink>
          </li>
          <li className="l-navigation__item">
            <MenuNavLink href="/contact/" className={`c-navigation-link${isCurrent('/contact') ? ' current' : ''}`} onLinkClick={onLinkClick}>
              Contact
            </MenuNavLink>
          </li>
        </ul>
      </nav>
      <div className="l-header__sns">
        <MenuNavLink href="https://x.com/t_tomocan" className="l-header__sns__item --x" target="_blank" rel="noopener noreferrer" onLinkClick={onLinkClick}>
          <Image src="/img/common/icon_x.svg" alt="X" width={30} height={30} />
        </MenuNavLink>
        <MenuNavLink href="https://coconala.com/users/1531202" className="l-header__sns__item --coconala" target="_blank" rel="noopener noreferrer" onLinkClick={onLinkClick}>
          <Image src="/img/common/icon_coconala.svg" alt="coconala" width={40} height={40} />
        </MenuNavLink>
      </div>
    </>
  );
}
