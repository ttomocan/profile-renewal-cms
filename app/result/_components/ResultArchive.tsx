import PageTitle from '@/app/_components/PageTitle';
import Breadcrumb from '@/app/_components/Breadcrumb';
import BreadcrumbListJsonLd from '@/app/_components/BreadcrumbListJsonLd';
import ItemListJsonLd from '@/app/_components/ItemListJsonLd';
import Pagination from '@/components/Pagination';
import ResultCard from '@/components/ResultCard';
import type { ResultsResponse } from '@/types/results';

type Props = {
  currentPage: number;
  resultsData: ResultsResponse;
};

export default function ResultArchive({ currentPage, resultsData }: Props) {
  const { contents: results, totalCount, limit } = resultsData;
  const totalPages = Math.ceil(totalCount / limit);
  const pagePath = currentPage === 1 ? '/result/' : `/result/p/${currentPage}/`;
  const pageLabel = currentPage === 1 ? 'Web制作実績' : `Web制作実績（${currentPage}ページ目）`;
  const breadcrumbItems = [
    { label: 'トップ', href: '/' },
    ...(currentPage > 1 ? [{ label: 'Web制作実績', href: '/result/' }] : []),
    { label: currentPage === 1 ? 'Web制作実績' : `${currentPage}ページ目`, active: true },
  ];

  return (
    <>
      <PageTitle title="Result" sub={pageLabel} />
      <Breadcrumb items={breadcrumbItems} />
      <main className="results-main">
        <div className="results-inner">
          <section className="results-intro" aria-labelledby="results-list-heading">
            <h2 id="results-list-heading" className="u-visually-hidden">
              {pageLabel}の一覧
            </h2>
            <p>
              制作したサイトの種類、本人が担当した範囲、使用技術、制作期間を一覧で確認できます。実装時の判断や工夫は各詳細ページに掲載しています。
              {currentPage > 1 && ` 現在は${currentPage}ページ目です。`}
            </p>
          </section>

          {results.length > 0 ? (
            <>
              <div className="results-grid">
                {results.map((result) => (
                  <ResultCard key={result.id} result={result} />
                ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </>
          ) : (
            <div className="results-empty">
              <div className="results-empty__icon" aria-hidden="true">
                📝
              </div>
              <h2 className="results-empty__title">実績がまだ登録されていません</h2>
              <p className="results-empty__description">近日中に実績を公開予定です</p>
            </div>
          )}
        </div>
      </main>
      <ItemListJsonLd items={results} listName={`${pageLabel}一覧`} pagePath={pagePath} startPosition={(currentPage - 1) * limit + 1} />
      <BreadcrumbListJsonLd items={breadcrumbItems} />
    </>
  );
}
