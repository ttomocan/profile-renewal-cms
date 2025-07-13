import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getBlogList } from '@/app/_libs/microcms';
import DiaryList from '@/app/_components/DiaryList';
import DiaryListSkeleton from '@/app/_components/DiaryListSkeleton';
import Pagination from '@/app/_components/Pagination';
import { DIARY_LIST_LIMIT } from '@/app/_constants';

type Props = {
  params: {
    current: string;
  };
};

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

  return (
    <>
      <section className="inner">
        <Suspense fallback={<DiaryListSkeleton />}>
          <DiaryListContent current={current} />
        </Suspense>
      </section>
    </>
  );
}
