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

export async function generateMetadata({ pathname }: { pathname: string }): Promise<Metadata> {
  const isHomePage = pathname === '/';
  const baseTitle = 'ともきゃんスタイル - プロフィールサイト';
  const description = 'Webエンジニア兼ブロガーとして活動するともきゃんのプロフィールサイト。自己紹介やWeb制作やブログ運営、SEO対策のスキルを紹介しています。ブログ運営やWeb制作のお悩みがあれば、ぜひご相談ください！';

  const canonicalPath = pathname.endsWith('/') ? pathname : `${pathname}/`;
  const canonicalUrl = isHomePage ? isHomePage : `${isHomePage}${canonicalPath}`;

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
      images: [
        {
          url: '/img/common/ogp.png',
          width: 1200,
          alt: 'ともきゃんスタイル',
        },
      ],
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
      images: [`/img/common/ogp.png?timestamp=${Date.now()}`],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <DynamicBodyClass />
        <Loading />
        <Header />
        <div className="l-content">{children}</div>
        <Blog />
        <Footer />
        <PageTop />
        <script src="/scripts/script.js" async></script>
        <script src="/scripts/animation.js" async></script>
      </body>
      {/* <GoogleAnalytics gaId="G-XXXXX" /> */}
    </html>
  );
}
