'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PageTop() {
  // クラス名の状態を管理
  const [isVisible, setIsVisible] = useState(false);
  const [isOnFooter, setIsOnFooter] = useState(false);

  useEffect(() => {
    // スクロール位置に応じてクラスを切り替える
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollThreshold = 300;

      // スクロール位置に応じて表示/非表示を切り替え
      setIsVisible(scrollTop > scrollThreshold);

      // フッター位置に応じてクラスを切り替え
      const blog = document.querySelector('.blog-area');
      if (blog) {
        const blogPosition = blog.getBoundingClientRect().top + window.scrollY;
        const scrollPosition = window.scrollY + window.innerHeight;
        setIsOnFooter(scrollPosition >= blogPosition);
      }
    };

    // 初期状態を設定
    handleScroll();

    // スクロールイベントリスナーを追加
    window.addEventListener('scroll', handleScroll);

    // クリーンアップ
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // クラス名を動的に生成
  const className = `c-pagetop${isVisible ? ' show' : ''}${isOnFooter ? ' on-footer' : ''}`;

  return (
    <div className={className}>
      <div className="c-pagetop__icon"></div>
      <Link href="#" className="c-pagetop__link">
        PAGE TOP
      </Link>
    </div>
  );
}
