'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function DynamicBodyClass() {
  const pathname = usePathname();

  useEffect(() => {
    // パスに特定の文字列が含まれるかでクラスを設定
    let bodyClassName = '';

    if (pathname === '/') {
      bodyClassName = 'top';
    } else if (pathname.includes('/about')) {
      bodyClassName = 'about';
    } else if (pathname.includes('/skill')) {
      bodyClassName = 'skill';
    } else if (pathname.includes('/contact')) {
      bodyClassName = 'contact';
    } else if (pathname.includes('/blog')) {
      bodyClassName = 'blog';
    }

    // クラスの適用
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
