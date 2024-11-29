'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  const isCurrent = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };
  return (
    <>
      <div className="c-wave">
        <canvas id="waveCanvas"></canvas>
      </div>
      <footer className="l-footer">
        <div className="l-footer__navigation" role="navigation" aria-label="グローバルナビゲーション">
          <ul className="l-navigation">
            <li className="l-navigation__item">
              <Link href="/" className={`l-navigation__item ${isCurrent('/') ? 'current' : ''}`}>
                Top
              </Link>
            </li>
            <li className="l-navigation__item">
              <Link href="/about/" className={`l-navigation__item ${isCurrent('/about') ? 'current' : ''}`}>
                About
              </Link>
            </li>
            <li className="l-navigation__item">
              <Link href="/skill/" className={`l-navigation__item ${isCurrent('/skill') ? 'current' : ''}`}>
                Skill
              </Link>
            </li>
            <li className="l-navigation__item">
              <Link href="/blog/" className={`l-navigation__item ${isCurrent('/blog') ? 'current' : ''}`}>
                Blog
              </Link>
            </li>
            <li className="l-navigation__item">
              <Link href="/contact/" className={`l-navigation__item ${isCurrent('/contact') ? 'current' : ''}`}>
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="l-footer__copyright">
          <small>&copy; {new Date().getFullYear()} ともきゃんスタイル inc.</small>
        </div>
      </footer>
    </>
  );
}
