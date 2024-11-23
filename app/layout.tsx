import '../styles/common/style.scss';
import '../styles/common/animation.scss';

import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import Loading from './_components/Loading';
import Header from './_components/Header';
import Blog from './_components/Blog';
import Footer from './_components/Footer';
import PageTop from './_components/PageTop';
import DynamicBodyClass from './DynamicBodyClass';

export async function generateMetadata({ pathname }: { pathname: string }): Promise<Metadata> {
  const isHomePage = pathname === '/';

  return {
    metadataBase: new URL('http://localhost:3000'),
    title: {
      template: '%s | ともきゃんスタイル - プロフィールサイト',
      default: 'ともきゃんスタイル - プロフィールサイト',
    },
    description: 'Webエンジニア兼ブロガーとして活動するともきゃんのプロフィールサイト。自己紹介やWeb制作やブログ運営、SEO対策のスキルを紹介しています。ブログ運営やWeb制作のお悩みがあれば、ぜひご相談ください！',
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    openGraph: {
      title: 'ともきゃんスタイル - プロフィールサイト',
      type: isHomePage ? 'website' : 'article',
      description: 'Webエンジニア兼ブロガーとして活動するともきゃんのプロフィールサイト。自己紹介やWeb制作やブログ運営、SEO対策のスキルを紹介しています。ブログ運営やWeb制作のお悩みがあれば、ぜひご相談ください！',
      images: ['/common/ogp.png'],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@t_tomocan',
      title: 'ともきゃんスタイル - プロフィールサイト',
      description: 'Webエンジニア兼ブロガーとして活動するともきゃんのプロフィールサイト。自己紹介やWeb制作やブログ運営、SEO対策のスキルを紹介しています。ブログ運営やWeb制作のお悩みがあれば、ぜひご相談ください！',
    },
    alternates: {
      canonical: 'http://localhost:3000',
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Caveat+Brush&family=Noto+Sans+JP:wght@400..700&family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
        <script src="/scripts/jquery-3.7.1.js" defer></script>
        <script src="/scripts/script.js" defer></script>
        <script src="/scripts/animation.js" defer></script>
      </head>
      <body>
        <DynamicBodyClass />
        {/* <Loading /> */}
        <Header />
        <div className="l-content">{children}</div>
        <Blog />
        <div className="c-wave">
          <canvas id="waveCanvas"></canvas>
        </div>
        <Footer />
        <PageTop />
      </body>
      {/* <GoogleAnalytics gaId="G-XXXXX" /> */}
    </html>
  );
}
