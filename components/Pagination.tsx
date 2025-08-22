import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: URLSearchParams;
}

export default function Pagination({ currentPage, totalPages, searchParams }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  // ページネーションリンクを生成する関数
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) {
      params.delete('page');
    } else {
      params.set('page', page.toString());
    }
    const queryString = params.toString();
    return `/results${queryString ? `?${queryString}` : ''}`;
  };

  // 表示するページ番号の範囲を計算
  const getPageNumbers = () => {
    const delta = 2; // 現在のページの前後に表示するページ数
    const range = [];
    const rangeWithDots = [];

    // 最初のページ
    range.push(1);

    // 現在のページ周辺
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // 最後のページ
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // 重複を削除
    const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

    // ドットを挿入
    let prev = 0;
    for (const page of uniqueRange) {
      if (page - prev === 2) {
        rangeWithDots.push(prev + 1);
      } else if (page - prev !== 1) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(page);
      prev = page;
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="results-pagination" aria-label="ページネーション">
      {/* 前のページボタン */}
      {currentPage > 1 ? (
        <Link href={getPageUrl(currentPage - 1)} className="results-pagination__item results-pagination__item--prev" aria-label="前のページ">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          前へ
        </Link>
      ) : (
        <span className="results-pagination__item results-pagination__item--disabled">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          前へ
        </span>
      )}

      {/* ページ番号 */}
      {pageNumbers.map((pageNumber, index) => {
        if (pageNumber === '...') {
          return (
            <span key={`dots-${index}`} className="results-pagination__item">
              ...
            </span>
          );
        }

        const page = pageNumber as number;
        const isCurrentPage = page === currentPage;

        return isCurrentPage ? (
          <span key={page} className="results-pagination__item results-pagination__item--current" aria-current="page">
            {page}
          </span>
        ) : (
          <Link key={page} href={getPageUrl(page)} className="results-pagination__item">
            {page}
          </Link>
        );
      })}

      {/* 次のページボタン */}
      {currentPage < totalPages ? (
        <Link href={getPageUrl(currentPage + 1)} className="results-pagination__item results-pagination__item--next" aria-label="次のページ">
          次へ
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <span className="results-pagination__item results-pagination__item--disabled">
          次へ
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}

      {/* ページ情報 */}
      <div className="results-pagination__info">
        <span>
          {totalPages}ページ中 <strong>{currentPage}</strong> ページ目
        </span>
      </div>
    </nav>
  );
}
