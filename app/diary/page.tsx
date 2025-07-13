import { Suspense } from 'react';
import { getBlogList } from '@/app/_libs/microcms';
import DiaryList from '@/app/_components/DiaryList';
import DiaryListSkeleton from '@/app/_components/DiaryListSkeleton';
import Pagination from '@/app/_components/Pagination';
import SearchField from '@/app/_components/SearchField';
import { DIARY_LIST_LIMIT } from '@/app/_constants';

// データ取得用のコンポーネント
async function DiaryListContent() {
  const { contents: blog, totalCount } = await getBlogList({
    limit: DIARY_LIST_LIMIT,
  });

  return (
    <>
      <DiaryList blog={blog} />
      <Pagination totalCount={totalCount} />
    </>
  );
}

export default function Page() {
  return (
    <>
      <section className="inner">
        <SearchField />
        <Suspense fallback={<DiaryListSkeleton />}>
          <DiaryListContent />
        </Suspense>
      </section>
    </>
  );
}
