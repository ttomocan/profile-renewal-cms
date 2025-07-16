'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function Footer() {
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // クライアントサイドでのみ年号を設定するため、初期値はnull
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  const isCurrent = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // waveCanvasの初期化をクライアントサイドのみで行う
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // キャンバスのサイズをクライアント側で設定
    const updateCanvasSize = () => {
      canvas.width = document.documentElement.clientWidth;
      canvas.height = 100; // 固定の高さ
    };

    // 初期サイズ設定
    updateCanvasSize();

    // リサイズイベントのハンドラ
    const handleResize = () => {
      updateCanvasSize();
    };

    // リサイズイベントリスナー
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 年号をクライアントサイドでのみ設定
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <>
      <div className="c-wave">
        <canvas id="waveCanvas" ref={canvasRef}></canvas>
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
