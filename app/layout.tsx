import '@/styles/common/style.scss';
import '@/styles/common/animation.scss';

//import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata, Viewport } from 'next';
import Loading from './_components/Loading';
import Header from './_components/Header';
import Blog from './_components/Blog';
import Footer from './_components/Footer';
import PageTop from './_components/PageTop';
import DynamicBodyClass from './DynamicBodyClass';
import WebsiteJsonLd from './_components/WebsiteJsonLd';
import ClientSmoothScrollProvider from './_components/ClientSmoothScrollProvider';

const siteKeywords = [
  'Webエンジニア',
  'ブロガー',
  '名古屋',
  'Web制作',
  'WordPress',
  'Next.js',
  'React',
  'TypeScript',
];

export async function generateMetadata(): Promise<Metadata> {
  const baseTitle = 'Webエンジニア ともきゃん｜Web制作・UI改善・SEOの実績';
  const description = 'Web制作会社で10年以上、200サイト以上の制作に携わってきたWebエンジニア・ともきゃんのポートフォリオ。WordPress、フロントエンド、CMS構築、UI改善、SEO、個人開発の実績を紹介します。';

  return {
    metadataBase: new URL('https://www.tomocan.site'),
    title: baseTitle,
    description,
    keywords: siteKeywords,
    category: 'technology',
    authors: [{ name: 'ともきゃん', url: 'https://www.tomocan.site/about/' }],
    creator: 'ともきゃん',
    publisher: 'ともきゃんスタイル',
    alternates: {
      canonical: 'https://www.tomocan.site/',
    },
    icons: {
      icon: '/icon.png',
      apple: '/apple-icon.png',
    },
    openGraph: {
      title: baseTitle,
      type: 'website',
      description,
      url: 'https://www.tomocan.site/',
      images: ['/img/common/ogp.png'],
      siteName: 'ともきゃんスタイル',
      locale: 'ja_JP',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@t_tomocan',
      title: baseTitle,
      description,
      images: ['/img/common/ogp.png'],
    },
  };
}


export const viewport: Viewport = {
  themeColor: '#fcf6f1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <noscript>
          <style>{`.loading{display:none!important}.fadeInTrigger,.fadeUpTrigger,.fadeDownTrigger,.fadeLeftTrigger,.fadeRightTrigger,.flipDownTrigger,.flipLeftTrigger,.flipRightTrigger,.rotateXTrigger,.rotateYTrigger,.zoomInTrigger,.zoomOutTrigger,.blurTrigger,.smoothTrigger{opacity:1!important;transform:none!important}`}</style>
        </noscript>
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
