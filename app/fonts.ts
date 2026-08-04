import localFont from 'next/font/local';

export const roboto = localFont({
  src: [
    {
      path: '../public/fonts/Roboto/Roboto-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Roboto/Roboto-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-roboto',
  display: 'swap',
  preload: true,
  fallback: ['Arial'],
  adjustFontFallback: 'Arial',
});

export const caveatBrush = localFont({
  src: '../public/fonts/Caveat_Brush/CaveatBrush-Regular.woff2',
  weight: '400',
  style: 'normal',
  variable: '--font-caveat-brush',
  display: 'swap',
  preload: false,
  fallback: ['cursive'],
  adjustFontFallback: false,
});
