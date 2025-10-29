'use client';

import { useEffect } from 'react';

export default function FontLoader() {
  useEffect(() => {
    // フォントが既に読み込まれている場合はクラスを追加
    if (document.fonts.check('400 1em "Caveat Brush"')) {
      document.documentElement.classList.add('fonts-loaded');
      return;
    }

    // フォントの読み込みを監視
    const caveatBrushFont = new FontFace('Caveat Brush', 'url(/fonts/Caveat_Brush/CaveatBrush-Regular.woff2) format("woff2")', { weight: '400', style: 'normal' });

    caveatBrushFont
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        document.documentElement.classList.add('fonts-loaded');
      })
      .catch((error) => {
        console.error('Caveat Brush font failed to load:', error);
        // フォント読み込み失敗時もクラスを追加してフォールバックフォントを表示
        document.documentElement.classList.add('fonts-loaded');
      });

    // タイムアウト設定（3秒後に強制的に表示）
    const timeout = setTimeout(() => {
      if (!document.documentElement.classList.contains('fonts-loaded')) {
        document.documentElement.classList.add('fonts-loaded');
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return null;
}
