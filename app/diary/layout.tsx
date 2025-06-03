import './globals.css';
import '@/styles/pages/diary.scss';
import PageTitle from '@/app/_components/PageTitle';
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

  return {
    title: META_TITLE,
    openGraph: {
      title: META_TITLE,
      images: [imageUrl],
    },
    twitter: {
      title: META_TITLE,
      images: [imageUrl],
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageTitle title="Diary" sub={META_TITLE} />
      <main>{children}</main>
    </>
  );
}
