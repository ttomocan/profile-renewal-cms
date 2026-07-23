import './globals.css';
import PageTitle from '@/app/_components/PageTitle';
import type { Metadata } from 'next';

// メタデータの定数
const META_TITLE = '活動記録｜Web開発・ブログ運営・個人開発';
const DEFAULT_OGP_IMAGE = '/img/common/ogp.png';

/**
 * メタデータを生成する
 */
export async function generateMetadata(): Promise<Metadata> {
  const description = 'Webエンジニア・ともきゃんの活動記録。Web制作、個人開発、ブログ運営、働き方やキャリアについて、継続して取り組んだことと学びを発信しています。';

  return {
    title: META_TITLE,
    description,
    alternates: {
      canonical: 'https://www.tomocan.site/diary/',
    },
    openGraph: {
      title: META_TITLE,
      description,
      url: 'https://www.tomocan.site/diary/',
      type: 'website',
      images: [DEFAULT_OGP_IMAGE],
      siteName: 'ともきゃんスタイル',
      locale: 'ja_JP',
    },
    twitter: {
      card: 'summary_large_image',
      title: META_TITLE,
      description,
      images: [DEFAULT_OGP_IMAGE],
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageTitle title="Diary" sub="ともきゃん日記" isHeading={false} />
      <main>{children}</main>
    </>
  );
}
