import '@/styles/common/style.scss';
import '@/styles/common/animation.scss';

//import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata, Viewport } from 'next';
import Loading from './_components/Loading';
import Header from './_components/Header';
import Footer from './_components/Footer';
import PageTop from './_components/PageTop';
import DynamicBodyClass from './DynamicBodyClass';
import WebsiteJsonLd from './_components/WebsiteJsonLd';
import ClientSmoothScrollProvider from './_components/ClientSmoothScrollProvider';
import { createMetadata, SITE_NAME, SITE_URL } from '@/lib/seo';
import { roboto } from './fonts';

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

const homeTitle = 'Webエンジニア ともきゃん｜WordPress・UI改善・SEOの実績';
const homeDescription = 'Web制作会社で10年以上、200サイト以上の制作に携わってきたWebエンジニア・ともきゃんのポートフォリオです。WordPress、CMS構築、フロントエンド、UI改善、SEO、Next.js、個人開発の実績を紹介します。';

export const metadata: Metadata = {
  ...createMetadata({
    title: homeTitle,
    description: homeDescription,
    path: '/',
  }),
    metadataBase: new URL(SITE_URL),
    keywords: siteKeywords,
    category: 'technology',
    authors: [{ name: 'ともきゃん', url: `${SITE_URL}/about/` }],
    creator: 'ともきゃん',
    publisher: SITE_NAME,
    icons: {
      icon: '/icon.png',
      apple: '/apple-icon.png',
    },
};


export const viewport: Viewport = {
  themeColor: '#fcf6f1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={roboto.variable}>
      <head>
        <noscript>
          <style>{`.loading{display:none!important}.fadeInTrigger,.fadeUpTrigger,.fadeDownTrigger,.fadeLeftTrigger,.fadeRightTrigger,.flipDownTrigger,.flipLeftTrigger,.flipRightTrigger,.rotateXTrigger,.rotateYTrigger,.zoomInTrigger,.zoomOutTrigger,.blurTrigger,.smoothTrigger{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//images.microcms-assets.io" />

        {/* Resource hints for performance */}
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body suppressHydrationWarning>
        <ClientSmoothScrollProvider />
        <DynamicBodyClass />
        <Loading />
        <Header />
        <div className="l-content">{children}</div>
        <Footer />
        <PageTop />
        <WebsiteJsonLd />
      </body>
      {/* <GoogleAnalytics gaId="G-XXXXX" /> */}
    </html>
  );
}
