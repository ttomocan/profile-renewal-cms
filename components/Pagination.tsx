import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

type PageNumber = number | 'ellipsis';

export function getResultPageUrl(page: number): string {
  return page === 1 ? '/result/' : `/result/p/${page}/`;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const range = [1];
  for (let page = Math.max(2, currentPage - 2); page <= Math.min(totalPages - 1, currentPage + 2); page += 1) {
    range.push(page);
  }
  if (totalPages > 1) range.push(totalPages);

  const uniqueRange = [...new Set(range)].sort((a, b) => a - b);
  const pageNumbers: PageNumber[] = [];
  uniqueRange.forEach((page, index) => {
    const previous = uniqueRange[index - 1];
    if (previous && page - previous > 1) pageNumbers.push('ellipsis');
    pageNumbers.push(page);
  });

  return (
    <nav className="results-pagination" aria-label="制作実績のページナビゲーション">
      {currentPage > 1 ? (
        <Link href={getResultPageUrl(currentPage - 1)} className="results-pagination__item results-pagination__item--prev" rel="prev">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          前の実績ページ
        </Link>
      ) : (
        <span className="results-pagination__item results-pagination__item--disabled" aria-disabled="true">
          前へ
        </span>
      )}

      {pageNumbers.map((pageNumber, index) =>
        pageNumber === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="results-pagination__item" aria-hidden="true">
            …
          </span>
        ) : pageNumber === currentPage ? (
          <span key={pageNumber} className="results-pagination__item results-pagination__item--current" aria-current="page">
            {pageNumber}
          </span>
        ) : (
          <Link key={pageNumber} href={getResultPageUrl(pageNumber)} className="results-pagination__item" aria-label={`制作実績 ${pageNumber}ページ目`}>
            {pageNumber}
          </Link>
        ),
      )}

      {currentPage < totalPages ? (
        <Link href={getResultPageUrl(currentPage + 1)} className="results-pagination__item results-pagination__item--next" rel="next">
          次の実績ページ
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <span className="results-pagination__item results-pagination__item--disabled" aria-disabled="true">
          次へ
        </span>
      )}

      <p className="results-pagination__info">
        {totalPages}ページ中 <strong>{currentPage}</strong>ページ目
      </p>
    </nav>
  );
}
