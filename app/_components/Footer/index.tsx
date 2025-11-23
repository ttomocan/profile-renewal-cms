'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import WaveAnimation from '@/app/_components/WaveAnimation';

export default function Footer() {
  const pathname = usePathname();
  // クライアントサイドでのみ年号を設定するため、初期値はnull
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  const isCurrent = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // 年号をクライアントサイドでのみ設定
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <>
      <div className="c-wave">
        <WaveAnimation height={100} />
      </div>
      <footer className="l-footer">
        <div className="l-footer__navigation" role="navigation" aria-label="グローバルナビゲーション">
          <ul className="l-navigation">
            <li className="l-navigation__item">
              <Link href="/" className={`c-navigation-link ${isCurrent('/') ? 'current' : ''}`}>
                Top
              </Link>
            </li>
            <li className="l-navigation__item">
              <Link href="/about/" className={`c-navigation-link ${isCurrent('/about') ? 'current' : ''}`}>
                About
              </Link>
            </li>
            <li className="l-navigation__item">
              <Link href="/skill/" className={`c-navigation-link ${isCurrent('/skill') ? 'current' : ''}`}>
                Skill
              </Link>
            </li>
            <li className="l-navigation__item">
              <Link href="/result/" className={`c-navigation-link ${isCurrent('/result') ? 'current' : ''}`}>
                Result
              </Link>
            </li>
            <li className="l-navigation__item">
              <Link href="/diary/" className={`c-navigation-link ${isCurrent('/diary') ? 'current' : ''}`}>
                Diary
              </Link>
            </li>
            <li className="l-navigation__item">
              <Link href="/contact/" className={`c-navigation-link ${isCurrent('/contact') ? 'current' : ''}`}>
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="l-footer__copyright">
          <small>&copy; {currentYear || '2024'} ともきゃんスタイル inc.</small>
        </div>
      </footer>
    </>
  );
}
