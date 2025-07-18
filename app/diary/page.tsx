import styles from './page.module.css';
import { Suspense } from 'react';
import { getBlogList, getAllCategoryList } from '@/app/_libs/microcms';
import DiaryList from '@/app/_components/DiaryList';
import DiaryListSkeleton from '@/app/_components/DiaryListSkeleton';
import Pagination from '@/app/_components/Pagination';
import SearchField from '@/app/_components/SearchField';
import CategoryFilter from '@/app/_components/CategoryFilter';
import { DIARY_LIST_LIMIT } from '@/app/_constants';

// データ取得用のコンポーネント
async function DiaryListContent({ searchParams }: { searchParams: { q?: string; category?: string } }) {
  const queries: any = {
    limit: DIARY_LIST_LIMIT,
  };

  // 検索クエリがある場合
  if (searchParams.q) {
    queries.q = searchParams.q;
  }

  // カテゴリー絞り込みがある場合
  if (searchParams.category) {
    queries.filters = `category[equals]${searchParams.category}`;
  }

  const { contents: blog, totalCount } = await getBlogList(queries);

  return (
    <>
      <DiaryList blog={blog} />
      <Pagination totalCount={totalCount} />
    </>
  );
}

export default async function Page({ searchParams }: { searchParams: { q?: string; category?: string } }) {
  const categories = await getAllCategoryList();
  return (
    <>
      <section className="inner">
        <div className={styles['diary-search-row']}>
          <SearchField defaultValue={searchParams.q} />
          <CategoryFilter categories={categories} selectedCategoryId={searchParams.category} />
        </div>
        <Suspense fallback={<DiaryListSkeleton />}>
          <DiaryListContent searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}
