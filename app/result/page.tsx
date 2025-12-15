import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getResults } from '@/app/_libs/microcms';
import { normalizePage } from '@/lib/parse';
// シンプルな検索パラメータ型（ページングのみ）
interface SimpleSearchParams {
  page?: string;
}
import ResultCard from '@/components/ResultCard';
import Pagination from '@/components/Pagination';
import PageTitle from '@/app/_components/PageTitle';
import Breadcrumb from '@/app/_components/Breadcrumb';
import ItemListJsonLd from '@/app/_components/ItemListJsonLd';
import BreadcrumbListJsonLd from '@/app/_components/BreadcrumbListJsonLd';
import '@/styles/pages/result.scss';

interface ResultsPageProps {
  searchParams: Promise<SimpleSearchParams>;
}

export async function generateMetadata(): Promise<Metadata> {
  const siteName = 'ともきゃんスタイル';
  const description = 'Web制作経験9年、200サイト以上の構築実績。WordPress、Next.js、Reactを使ったWebサイト制作、ブログカスタマイズ、デザイン制作など、ともきゃんの制作実績を一覧でご覧いただけます。';

  return {
    title: `実績紹介 | ${siteName}`,
    description,
    alternates: {
      canonical: 'https://www.tomocan.site/result/',
    },
    openGraph: {
      title: `実績紹介 | ${siteName}`,
      description,
      url: 'https://www.tomocan.site/result/',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `実績紹介 | ${siteName}`,
      description,
    },
  };
}

// Loading component for results
function ResultsLoading() {
  return (
    <div className="results-loading">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="result-loading-card">
          <div className="result-loading-card__image"></div>
          <div className="result-loading-card__content">
            <div className="result-loading-card__line result-loading-card__line--short"></div>
            <div className="result-loading-card__line result-loading-card__line--medium"></div>
            <div className="result-loading-card__line result-loading-card__line--long"></div>
            <div className="result-loading-card__line result-loading-card__line--short"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Results content component
async function ResultsContent({ searchParams }: { searchParams: SimpleSearchParams }) {
  const page = normalizePage(searchParams.page || null);
  const limit = 12;
  const offset = (page - 1) * limit;

  // 実績データを取得（フィルタなし、新着順）
  const resultsData = await getResults({
    limit,
    offset,
    sort: 'new', // 新着順固定
  });

  const { contents: results, totalCount } = resultsData;
  const totalPages = Math.ceil(totalCount / limit);

  // URLSearchParamsを作成（Paginationで使用）
  const urlSearchParams = new URLSearchParams();
  // シンプルな一覧表示のため、ページパラメータのみ保持

  return (
    <>
      {/* フィルタ機能は一旦非表示 */}
      {/* <Filters workTypes={workTypes} projectTypes={projectTypes} roles={roles} /> */}

      {/* 実績数表示 */}
      {/* <div className="results-summary">
        <p className="results-summary__text">
          {totalCount > 0 ? (
            <>
              <strong>{totalCount}</strong>件の実績を掲載しています
              {page > 1 && (
                <span className="ml-2">
                  （{offset + 1}〜{Math.min(offset + limit, totalCount)}件目を表示）
                </span>
              )}
            </>
          ) : (
            '実績がまだ登録されていません'
          )}
        </p>
      </div> */}

      {/* 実績紹介 */}
      {results.length > 0 ? (
        <>
          <div className="results-grid">
            {results.map((result, index) => (
              <ResultCard
                key={`${result.id}-${index}`}
                result={result}
                priority={index < 3} // 最初の3つの画像を優先読み込み
              />
            ))}
          </div>

          {/* ページネーション */}
          <Pagination currentPage={page} totalPages={totalPages} searchParams={urlSearchParams} />
        </>
      ) : (
        <div className="results-empty">
          <div className="results-empty__icon">📝</div>
          <h3 className="results-empty__title">実績がまだ登録されていません</h3>
          <p className="results-empty__description">近日中に実績を公開予定です</p>
        </div>
      )}
    </>
  );
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const resolvedSearchParams = await searchParams;
  const breadcrumbItems = [
    { label: 'トップ', href: '/' },
    { label: '実績紹介', active: true },
  ];

  // 実績データを取得（ItemListJsonLd用）
  const resultsData = await getResults({
    limit: 12,
    offset: 0,
    sort: 'new',
  });

  return (
    <>
      {/* ページタイトル */}
      <PageTitle title="Result" sub="実績紹介" />

      {/* パンくずリスト */}
      <Breadcrumb items={breadcrumbItems} />

      <main className="results-main">
        <div className="results-inner">
          {/* 実績コンテンツ（Suspense でラップ） */}
          <Suspense fallback={<ResultsLoading />}>
            <ResultsContent searchParams={resolvedSearchParams} />
          </Suspense>
        </div>
      </main>
      <ItemListJsonLd items={resultsData.contents} listName="ともきゃんの制作実績一覧" />
      <BreadcrumbListJsonLd items={breadcrumbItems} />
    </>
  );
}
