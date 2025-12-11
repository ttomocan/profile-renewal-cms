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
import ThemeColorProvider from './_components/ThemeColorProvider';
import FontLoader from './_components/FontLoader';

export async function generateMetadata(): Promise<Metadata> {
  const baseTitle = 'ともきゃんスタイル - プロフィールサイト';
  const description = '名古屋のWebエンジニア兼ブロガー ともきゃんのプロフィールサイト。Web制作経験9年、200サイト以上の構築実績。WordPress、Next.js、React、TypeScriptを使ったWeb制作が得意。ブログ運営やWeb制作のお悩み解決をサポートします。';

  // タイムスタンプの生成をサーバーサイドに固定
  const timestamp = Date.now();

  return {
    metadataBase: new URL('https://www.tomocan.site'),
    title: {
      template: `%s | ${baseTitle}`,
      default: baseTitle,
    },
    description,
    alternates: {
      canonical: 'https://www.tomocan.site/',
    },
    icons: {
      icon: '/icon.png',
      apple: '/apple-icon.png',
    },
    openGraph: {
      title: {
        template: `%s | ${baseTitle}`,
        default: baseTitle,
      },
      type: 'website',
      description,
      url: 'https://www.tomocan.site/',
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

        {/* Preload hero image for LCP optimization (トップページ用) */}
        <link
          rel="preload"
          as="image"
          href="/img/pages/top/img_hero.webp"
          // @ts-ignore - ReactではキャメルケースだがHTMLでは小文字
          imageSrcSet="/_next/image?url=%2Fimg%2Fpages%2Ftop%2Fimg_hero.webp&w=640&q=75 640w, /_next/image?url=%2Fimg%2Fpages%2Ftop%2Fimg_hero.webp&w=1080&q=75 1080w, /_next/image?url=%2Fimg%2Fpages%2Ftop%2Fimg_hero.webp&w=1920&q=75 1920w"
          // @ts-ignore
          imageSizes="100vw"
          // @ts-ignore
          fetchPriority="high"
        />

        {/* Resource hints for performance */}
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body suppressHydrationWarning>
        <ClientSmoothScrollProvider />
        <DynamicBodyClass />
        <ThemeColorProvider />
        <FontLoader />
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
