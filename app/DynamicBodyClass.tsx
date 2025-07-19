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
    } else if (pathname.includes('/diary')) {
      bodyClassName = 'diary';
    }

    // クラスの適用
    const body = document.body;

    // 既存のページクラスをすべて削除
    const pageClasses = ['top', 'about', 'skill', 'contact', 'diary'];
    pageClasses.forEach((cls) => {
      body.classList.remove(cls);
    });

    // 新しいクラスを追加
    if (bodyClassName) {
      body.classList.add(bodyClassName);
    }

    // Chrome拡張機能などによって追加される可能性のある属性を削除
    const removeUnwantedAttributes = () => {
      const unwantedAttributes = ['cz-shortcut-listen', 'data-new-gr-c-s-check-loaded', 'data-gr-ext-installed'];

      unwantedAttributes.forEach((attr) => {
        if (body.hasAttribute(attr)) {
          body.removeAttribute(attr);
        }
      });
    };

    // 初回実行
    removeUnwantedAttributes();

    // アニメーションクラスの初期化
    // fadeUpクラスがすでに付いていたら削除（サーバーとクライアントの不一致を防ぐ）
    document.querySelectorAll('.fadeUp').forEach((el) => {
      el.classList.remove('fadeUp');
    });

    // MutationObserverを使用して属性の変更を監視
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          removeUnwantedAttributes();
        }
      });
    });

    // body要素の属性変更を監視
    observer.observe(body, { attributes: true });

    // クリーンアップ時にクラスを削除とオブザーバーを停止
    return () => {
      if (bodyClassName) {
        body.classList.remove(bodyClassName);
      }
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
