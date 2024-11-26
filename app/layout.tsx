import '../styles/common/style.scss';
import '../styles/common/animation.scss';

//import { GoogleAnalytics } from '@next/third-parties/google';
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
    metadataBase: new URL('https://www.tomocan.site'),
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
      images: ['/img/common/ogp.png'],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@t_tomocan',
      title: 'ともきゃんスタイル - プロフィールサイト',
      description: 'Webエンジニア兼ブロガーとして活動するともきゃんのプロフィールサイト。自己紹介やWeb制作やブログ運営、SEO対策のスキルを紹介しています。ブログ運営やWeb制作のお悩みがあれば、ぜひご相談ください！',
    },
    alternates: {
      canonical: 'https://www.tomocan.site',
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
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
