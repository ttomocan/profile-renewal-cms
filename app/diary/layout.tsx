import './globals.css';
import '@/styles/pages/diary.scss';
import PageTitle from '@/app/_components/PageTitle';
import { getBlogList } from '@/app/_libs/microcms';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { contents } = await getBlogList({ limit: 1 });
  const latestPost = contents[0];
  const baseImageUrl = latestPost?.thumbnail?.url ?? '/img/common/ogp.png';
  const version = encodeURIComponent(latestPost?.revisedAt ?? latestPost?.publishedAt ?? Date.now());
  const imageUrl = `${baseImageUrl}?v=${version}`;

  return {
    title: '日記',
    openGraph: {
      title: '日記',
      images: [imageUrl],
    },
    twitter: {
      title: '日記',
      images: [imageUrl],
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageTitle title="Diary" sub="日記" />
      <main>{children}</main>
    </>
  );
}
