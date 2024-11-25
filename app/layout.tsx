import '../styles/common/style.scss';
import '../styles/common/animation.scss';
import { Roboto, Noto_Sans_JP, Caveat_Brush } from 'next/font/google';

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  fallback: ['Arial', 'sans-serif'],
});

const notoSansJP = Noto_Sans_JP({
  weight: ['400', '700'],
  subsets: ['latin'],
  fallback: ['Arial', 'sans-serif'],
});

const caveatBrush = Caveat_Brush({
  weight: '400',
  subsets: ['latin'],
  fallback: ['cursive'],
});

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
    <html lang="ja" className={`${roboto.className} ${notoSansJP.className}`}>
      <head>
        <script src="/scripts/animation.js" async></script>
        <script src="/scripts/script.js" async></script>
      </head>
      <body>
        <DynamicBodyClass />
        <Loading />
        <Header />
        <div className="l-content">{children}</div>
        <Blog />
        <Footer />
        <PageTop />
      </body>
      {/* <GoogleAnalytics gaId="G-XXXXX" /> */}
    </html>
  );
}
