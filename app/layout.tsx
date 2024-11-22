import './globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import Header from './_components/Header';
import Footer from './_components/Footer';
import PageTop from './_components/PageTop';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Header />
        {children}
        <Footer />
        <PageTop />
      </body>
      {/* <GoogleAnalytics gaId="G-XXXXX" /> */}
    </html>
  );
}
