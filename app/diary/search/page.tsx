import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getBlogList } from '@/app/_libs/microcms';
import { DIARY_LIST_LIMIT } from '@/app/_constants';
import DiaryList from '@/app/_components/DiaryList';
import DiaryListSkeleton from '@/app/_components/DiaryListSkeleton';
import SearchField from '@/app/_components/SearchField';
import styles from './page.module.css';
import Breadcrumb from '@/app/_components/Breadcrumb';
import BreadcrumbListJsonLd from '@/app/_components/BreadcrumbListJsonLd';

type Props = {
  searchParams: {
    q?: string;
  };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = searchParams.q;
  const title = query ? `「${query}」の検索結果` : '記事検索';
  const description = query
    ? `「${query}」に関する記事の検索結果を表示しています。ともきゃん日記の記事を検索できます。`
    : 'ともきゃん日記の記事を検索できます。Web制作、ブログ運営、日常の出来事など、気になるキーワードで記事を探してみてください。';

  return {
    title,
    description,
    alternates: {
      canonical: query
        ? `https://www.tomocan.site/diary/search/?q=${encodeURIComponent(query)}`
        : 'https://www.tomocan.site/diary/search/',
    },
    openGraph: {
      title,
      description,
      url: 'https://www.tomocan.site/diary/search/',
    },
    twitter: {
      title,
      description,
    },
  };
}

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
    { label: 'トップ', href: '/' },
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
      <BreadcrumbListJsonLd items={breadcrumbItems} />
    </>
  );
}
