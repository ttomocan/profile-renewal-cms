'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function DynamicBodyClass() {
  const pathname = usePathname();

  useEffect(() => {
    // パスごとのクラス名を設定
    const bodyClassName = pathname === '/' ? 'top' : pathname === '/about/' ? 'about' : pathname === '/skill/' ? 'skill' : pathname === '/contact/' ? 'contact' : pathname === '/blog/' ? 'blog' : '';

    // 既存クラスを保存して、必要なクラスだけ追加
    const body = document.body;
    if (bodyClassName) {
      body.classList.add(bodyClassName);
    }

    // クリーンアップ時にクラスを削除
    return () => {
      if (bodyClassName) {
        body.classList.remove(bodyClassName);
      }
    };
  }, [pathname]);

  return null;
}
