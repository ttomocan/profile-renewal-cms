import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getBlogList } from '@/app/_libs/microcms';
import DiaryList from '@/app/_components/DiaryList';
import DiaryListSkeleton from '@/app/_components/DiaryListSkeleton';
import Pagination from '@/app/_components/Pagination';
import Breadcrumb from '@/app/_components/Breadcrumb';
import BreadcrumbListJsonLd from '@/app/_components/BreadcrumbListJsonLd';
import { DIARY_LIST_LIMIT } from '@/app/_constants';

type Props = {
  params: Promise<{
    current: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const current = parseInt(resolvedParams.current as string, 10);
  const title = `活動記録 ${current}ページ目｜ともきゃん日記`;
  const description = `ともきゃん日記の記事一覧 ${current}ページ目。Webエンジニア・ブロガー ともきゃんの日常、Web制作の学び、ブログ運営のコツなどを発信しています。`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.tomocan.site/diary/p/${current}/`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.tomocan.site/diary/p/${current}/`,
      type: 'website',
      images: ['/img/common/ogp.png'],
      siteName: 'ともきゃんスタイル',
      locale: 'ja_JP',
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
      images: ['/img/common/ogp.png'],
    },
  };
}

// データ取得用のコンポーネント
async function DiaryListContent({ current }: { current: number }) {
  if (Number.isNaN(current) || current < 1) {
    notFound();
  }

  const { contents: blog, totalCount } = await getBlogList({
    limit: DIARY_LIST_LIMIT,
    offset: DIARY_LIST_LIMIT * (current - 1),
  });

  if (blog.length === 0) {
    notFound();
  }

  return (
    <>
      <DiaryList blog={blog} />
      <Pagination totalCount={totalCount} current={current} />
    </>
  );
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const current = parseInt(resolvedParams.current as string, 10);

  const breadcrumbItems = [
    { label: 'トップ', href: '/' },
    { label: 'ともきゃん日記', href: '/diary/' },
    { label: `${current}ページ目`, active: true },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <section className="inner">
        <h1 className="diary-archive-title">活動記録の記事一覧（{current}ページ目）</h1>
        <h2 className="u-visually-hidden">{current}ページ目の記事</h2>
        <Suspense fallback={<DiaryListSkeleton />}>
          <DiaryListContent current={current} />
        </Suspense>
      </section>
      <BreadcrumbListJsonLd items={breadcrumbItems} />
    </>
  );
}
