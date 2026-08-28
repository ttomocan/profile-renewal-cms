'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import WaveAnimation from '@/app/_components/WaveAnimation';
import { isCurrentPath } from '@/lib/navigation';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const isCurrent = (path: string) => isCurrentPath(pathname, path);

  return (
    <>
      <div className="c-wave">
        <WaveAnimation height={100} />
      </div>
      <footer className="l-footer">
        <div className="l-footer__navigation" role="navigation" aria-label="グローバルナビゲーション">
          <ul className="l-navigation">
            <li className="l-navigation__item">
              <Link href="/" aria-current={isCurrent('/') ? 'page' : undefined} className={`c-navigation-link${isCurrent('/') ? ' current' : ''}`}>
                Top
              </Link>
            </li>
            <li className="l-navigation__item">
              <Link href="/about/" aria-current={isCurrent('/about') ? 'page' : undefined} className={`c-navigation-link${isCurrent('/about') ? ' current' : ''}`}>
                About
              </Link>
            </li>
            <li className="l-navigation__item">
              <Link href="/skill/" aria-current={isCurrent('/skill') ? 'page' : undefined} className={`c-navigation-link${isCurrent('/skill') ? ' current' : ''}`}>
                Skill
              </Link>
            </li>
            <li className="l-navigation__item">
              <Link href="/result/" aria-current={isCurrent('/result') ? 'page' : undefined} className={`c-navigation-link${isCurrent('/result') ? ' current' : ''}`}>
                Result
              </Link>
            </li>
            <li className="l-navigation__item">
              <Link href="/diary/" aria-current={isCurrent('/diary') ? 'page' : undefined} className={`c-navigation-link${isCurrent('/diary') ? ' current' : ''}`}>
                Diary
              </Link>
            </li>
            <li className="l-navigation__item">
              <Link href="/contact/" aria-current={isCurrent('/contact') ? 'page' : undefined} className={`c-navigation-link${isCurrent('/contact') ? ' current' : ''}`}>
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="l-footer__copyright">
          <small>&copy; {currentYear} ともきゃんスタイル</small>
        </div>
      </footer>
    </>
  );
}
