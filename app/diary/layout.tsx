import './globals.css';
import PageTitle from '@/app/_components/PageTitle';
import Breadcrumb from '@/app/_components/Breadcrumb';
import { getBlogList } from '@/app/_libs/microcms';
import type { Metadata } from 'next';

// メタデータの定数
const META_TITLE = 'ともきゃん日記';
const DEFAULT_OGP_IMAGE = '/img/common/ogp.png';

/**
 * 画像URLにバージョンパラメータを付与する
 */
const getVersionedImageUrl = (baseUrl: string, timestamp: string) => {
  const version = encodeURIComponent(timestamp);
  return `${baseUrl}?v=${version}`;
};

/**
 * メタデータを生成する
 */
export async function generateMetadata(): Promise<Metadata> {
  // 最新の記事を1件取得
  const { contents } = await getBlogList({ limit: 1 });
  const latestPost = contents[0];

  // 画像URLの生成
  const baseImageUrl = latestPost?.thumbnail?.url ?? DEFAULT_OGP_IMAGE;
  const timestamp = latestPost?.revisedAt ?? latestPost?.publishedAt ?? Date.now().toString();
  const imageUrl = getVersionedImageUrl(baseImageUrl, timestamp);

  const description = 'Webエンジニア・ブロガー ともきゃんの日記。日常の出来事、Web制作の学び、ブログ運営のコツ、おすすめの本やツールなど、気ままに発信しています。SEOに縛られない、リアルな体験談をお届けします。';

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
      images: [imageUrl],
    },
    twitter: {
      title: META_TITLE,
      description,
      images: [imageUrl],
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const breadcrumbItems = [
    { label: 'ホーム', href: '/' },
    { label: 'ともきゃん日記', active: true },
  ];

  return (
    <>
      <PageTitle title="Diary" sub={META_TITLE} />
      <Breadcrumb items={breadcrumbItems} />
      <main>{children}</main>
    </>
  );
}
