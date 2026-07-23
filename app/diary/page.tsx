import styles from './page.module.css';
import { Suspense } from 'react';
import { getBlogList, getAllCategoryList } from '@/app/_libs/microcms';
import DiaryList from '@/app/_components/DiaryList';
import DiaryListSkeleton from '@/app/_components/DiaryListSkeleton';
import Pagination from '@/app/_components/Pagination';
import SearchField from '@/app/_components/SearchField';
import CategoryFilter from '@/app/_components/CategoryFilter';
import BreadcrumbListJsonLd from '@/app/_components/BreadcrumbListJsonLd';
import Breadcrumb from '@/app/_components/Breadcrumb';
import { DIARY_LIST_LIMIT } from '@/app/_constants';

type SearchParamsType = { q?: string; category?: string };

// データ取得用のコンポーネント
async function DiaryListContent({ searchParams }: { searchParams: SearchParamsType }) {
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

export default async function Page({ searchParams }: { searchParams: Promise<SearchParamsType> }) {
  const resolvedSearchParams = await searchParams;
  const categories = await getAllCategoryList();
  const breadcrumbItems = [
    { label: 'トップ', href: '/' },
    { label: 'ともきゃん日記', active: true },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <section className="inner">
        <div className={styles.intro}>
          <h1>Web開発・ブログ運営・個人開発の活動記録</h1>
          <p>人柄や継続して取り組む姿勢が伝わるよう、Web制作、個人開発、ブログ運営、働き方について記録しています。</p>
        </div>
        <h2 className="u-visually-hidden">活動記録の記事一覧</h2>
        <div className={styles['diary-search-row']}>
          <SearchField defaultValue={resolvedSearchParams.q} />
          <CategoryFilter categories={categories} selectedCategoryId={resolvedSearchParams.category} />
        </div>
        <Suspense fallback={<DiaryListSkeleton />}>
          <DiaryListContent searchParams={resolvedSearchParams} />
        </Suspense>
      </section>
      <BreadcrumbListJsonLd items={breadcrumbItems} />
    </>
  );
}
