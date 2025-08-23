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
import '@/styles/pages/results.scss';

interface ResultsPageProps {
  searchParams: SimpleSearchParams;
}

export async function generateMetadata(): Promise<Metadata> {
  const siteName = 'ともきゃんスタイル';

  return {
    title: `実績一覧 | ${siteName}`,
    description: 'ともきゃんスタイルの制作実績を一覧でご覧いただけます。Webサイト制作、ブログカスタマイズ、デザイン制作など多数の実績をご紹介しています。',
    openGraph: {
      title: `実績一覧 | ${siteName}`,
      description: 'ともきゃんスタイルの制作実績を一覧でご覧いただけます。',
      type: 'website',
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
async function ResultsContent({ searchParams }: ResultsPageProps) {
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

      {/* 実績一覧 */}
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

export default function ResultsPage({ searchParams }: ResultsPageProps) {
  const breadcrumbItems = [
    { label: 'ホーム', href: '/' },
    { label: '実績紹介', active: true },
  ];

  return (
    <>
      {/* パンくずリスト */}
      <Breadcrumb items={breadcrumbItems} />

      {/* ページタイトル */}
      <PageTitle title="Results" sub="実績紹介" />

      <main className="results-main">
        <div className="results-inner">
          {/* 実績コンテンツ（Suspense でラップ） */}
          <Suspense fallback={<ResultsLoading />}>
            <ResultsContent searchParams={searchParams} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
