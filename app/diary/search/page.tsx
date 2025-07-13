import { Suspense } from 'react';
import { getBlogList } from '@/app/_libs/microcms';
import { DIARY_LIST_LIMIT } from '@/app/_constants';
import DiaryList from '@/app/_components/DiaryList';
import DiaryListSkeleton from '@/app/_components/DiaryListSkeleton';
import SearchField from '@/app/_components/SearchField';

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
        <div className="search-info">
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

  return (
    <>
      <section className="inner">
        <SearchField defaultValue={query} />
        <Suspense fallback={<DiaryListSkeleton />}>
          <SearchResults query={query} />
        </Suspense>
      </section>
      <style jsx>{`
        .search-info {
          margin: 20px 0;
          padding: 10px 15px;
          background-color: #f5f5f5;
          border-radius: 6px;
          font-size: 0.95rem;
        }
      `}</style>
    </>
  );
}
