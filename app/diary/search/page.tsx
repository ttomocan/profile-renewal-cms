import { Suspense } from 'react';
import { getBlogList } from '@/app/_libs/microcms';
import { DIARY_LIST_LIMIT } from '@/app/_constants';
import DiaryList from '@/app/_components/DiaryList';
import DiaryListSkeleton from '@/app/_components/DiaryListSkeleton';
import SearchField from '@/app/_components/SearchField';
import styles from './page.module.css';
import Breadcrumb from '@/app/_components/Breadcrumb';

type Props = {
  searchParams: {
    q?: string;
  };
};

// 検索結果を表示するコンポーネント
async function SearchResults({ query }: { query: string | undefined }) {
  const { contents: blog, totalCount } = await getBlogList({
    limit: DIARY_LIST_LIMIT,
    q: query,
  });

  return (
    <>
      {query && (
        <div className={styles['search-info']}>
          <p>
            「{query}」の検索結果: {totalCount}件
          </p>
        </div>
      )}
      <DiaryList blog={blog} />
    </>
  );
}

export default function Page({ searchParams }: Props) {
  const query = searchParams.q;

  const breadcrumbItems = [
    { label: 'ホーム', href: '/' },
    { label: 'ともきゃん日記', href: '/diary/' },
    { label: '記事検索', active: true },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <section className="inner">
        <SearchField defaultValue={query} />
        <Suspense fallback={<DiaryListSkeleton />}>
          <SearchResults query={query} />
        </Suspense>
      </section>
    </>
  );
}
