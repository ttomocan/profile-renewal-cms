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

    // アニメーションクラスの初期化（Hydrationエラー対策）
    const initializeAnimationClasses = () => {
      // すべてのアニメーションクラスを削除してサーバーとクライアントの状態を一致させる
      const animationClasses = ['fadeIn', 'fadeUp', 'fadeDown', 'fadeLeft', 'fadeRight', 'flipDown', 'flipLeft', 'flipLeftTop', 'flipRight', 'flipRightTop', 'rotateX', 'rotateY', 'rotateLeftZ', 'rotateRightZ', 'zoomIn', 'zoomOut', 'blur', 'smooth'];

      animationClasses.forEach((className) => {
        document.querySelectorAll(`.${className}`).forEach((el) => {
          el.classList.remove(className);
        });
      });
    };

    // 初期化実行
    initializeAnimationClasses();

    // アニメーション処理を遅延実行（DOM安定化後）
    const initializeAnimations = () => {
      // animation.jsの処理を再現
      const fadeAnime = () => {
        const handleAnimation = (elements: NodeListOf<Element>, classToAdd: string, offset = 0) => {
          elements.forEach((element) => {
            const elemPos = element.getBoundingClientRect().top + window.pageYOffset + offset;
            const scroll = window.scrollY;
            const windowHeight = window.innerHeight;
            if (scroll >= elemPos - windowHeight) {
              element.classList.add(classToAdd);
            }
          });
        };

        const animationTypes = [
          { selector: '.fadeInTrigger', classToAdd: 'fadeIn', offset: -100 },
          { selector: '.fadeUpTrigger', classToAdd: 'fadeUp', offset: 150 },
          { selector: '.fadeDownTrigger', classToAdd: 'fadeDown', offset: 100 },
          { selector: '.fadeLeftTrigger', classToAdd: 'fadeLeft', offset: 100 },
          { selector: '.fadeRightTrigger', classToAdd: 'fadeRight', offset: 40 },
          { selector: '.flipDownTrigger', classToAdd: 'flipDown', offset: 150 },
          { selector: '.flipLeftTrigger', classToAdd: 'flipLeft', offset: -50 },
          { selector: '.flipLeftTopTrigger', classToAdd: 'flipLeftTop', offset: -50 },
          { selector: '.flipRightTrigger', classToAdd: 'flipRight', offset: -50 },
          { selector: '.flipRightTopTrigger', classToAdd: 'flipRightTop', offset: -50 },
          { selector: '.rotateXTrigger', classToAdd: 'rotateX', offset: -50 },
          { selector: '.rotateYTrigger', classToAdd: 'rotateY', offset: -50 },
          { selector: '.rotateLeftZTrigger', classToAdd: 'rotateLeftZ', offset: -50 },
          { selector: '.rotateRightZTrigger', classToAdd: 'rotateRightZ', offset: -50 },
        ];

        animationTypes.forEach(({ selector, classToAdd, offset }) => {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
            handleAnimation(elements, classToAdd, offset);
          }
        });
      };

      // 初回実行
      fadeAnime();

      // スクロールイベントリスナーを削除してから再追加
      window.removeEventListener('scroll', fadeAnime);
      window.removeEventListener('load', fadeAnime);
      window.addEventListener('scroll', fadeAnime);
      window.addEventListener('load', fadeAnime);

      return fadeAnime;
    };

    // DOM安定化後にアニメーションを初期化（Hydration完了まで待機）
    const timer = setTimeout(() => {
      // DOM更新が完了するまで追加待機
      requestAnimationFrame(() => {
        initializeAnimations();
      });
    }, 150);

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
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
