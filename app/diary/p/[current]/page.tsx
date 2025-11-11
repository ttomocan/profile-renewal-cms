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
  params: {
    current: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const current = parseInt(params.current as string, 10);
  const title = `ともきゃん日記 ${current}ページ目`;
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
    },
    twitter: {
      title,
      description,
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

export default function Page({ params }: Props) {
  const current = parseInt(params.current as string, 10);

  const breadcrumbItems = [
    { label: 'ホーム', href: '/' },
    { label: 'ともきゃん日記', href: '/diary/' },
    { label: `${current}ページ目`, active: true },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <section className="inner">
        <Suspense fallback={<DiaryListSkeleton />}>
          <DiaryListContent current={current} />
        </Suspense>
      </section>
      <BreadcrumbListJsonLd items={breadcrumbItems} />
    </>
  );
}
