import '@/styles/common/style.scss';
import '@/styles/common/animation.scss';

//import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import Loading from './_components/Loading';
import Header from './_components/Header';
import Blog from './_components/Blog';
import Footer from './_components/Footer';
import PageTop from './_components/PageTop';
import DynamicBodyClass from './DynamicBodyClass';
import WebsiteJsonLd from './_components/WebsiteJsonLd';
import ClientSmoothScrollProvider from './_components/ClientSmoothScrollProvider';

export async function generateMetadata({ pathname }: { pathname: string }): Promise<Metadata> {
  const isHomePage = pathname === '/';
  const baseTitle = 'ともきゃんスタイル - プロフィールサイト';
  const description = 'Webエンジニア兼ブロガーとして活動するともきゃんのプロフィールサイト。自己紹介やWeb制作やブログ運営、SEO対策など、私のスキルを紹介しています。ブログ運営やWeb制作のお悩みがあれば、ぜひご相談ください！';

  // タイムスタンプの生成をサーバーサイドに固定
  const timestamp = Date.now();

  return {
    metadataBase: new URL('https://www.tomocan.site'),
    title: {
      template: `%s | ${baseTitle}`,
      default: baseTitle,
    },
    description,
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-icon.png',
    },
    openGraph: {
      title: {
        template: `%s | ${baseTitle}`,
        default: baseTitle,
      },
      type: isHomePage ? 'website' : 'article',
      description,
      images: [`/img/common/ogp.png?timestamp=${timestamp}`],
      siteName: 'ともきゃんスタイル',
      locale: 'ja_JP',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@t_tomocan',
      title: {
        template: `%s | ${baseTitle}`,
        default: baseTitle,
      },
      description,
      images: [`/img/common/ogp.png?timestamp=${timestamp}`],
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//images.microcms-assets.io" />

        {/* Preload critical fonts */}
        <link rel="preload" href="/fonts/Roboto/Roboto-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Roboto/Roboto-Medium.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Roboto/Roboto-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Caveat_Brush/CaveatBrush-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />

        {/* Resource hints for performance */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body suppressHydrationWarning>
        <ClientSmoothScrollProvider />
        <DynamicBodyClass />
        <Loading />
        <Header />
        <div className="l-content">{children}</div>
        <Blog />
        <Footer />
        <PageTop />
        <WebsiteJsonLd />
      </body>
      {/* <GoogleAnalytics gaId="G-XXXXX" /> */}
    </html>
  );
}
