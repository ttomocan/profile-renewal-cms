'use client';

import { useEffect } from 'react';

export default function ThemeColorProvider() {
  useEffect(() => {
    // ページ背景色と同じ色をtheme-colorに設定
    const themeColor = '#fcf6f1'; // $baseCと同じ色

    // 既存のtheme-colorメタタグを更新または新規作成
    let themeColorMeta = document.querySelector('meta[name="theme-color"]');

    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', themeColor);
    } else {
      themeColorMeta = document.createElement('meta');
      themeColorMeta.setAttribute('name', 'theme-color');
      themeColorMeta.setAttribute('content', themeColor);
      document.head.appendChild(themeColorMeta);
    }
  }, []);

  return null;
}
