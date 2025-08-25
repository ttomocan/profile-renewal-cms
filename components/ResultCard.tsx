import Image from 'next/image';
import Link from 'next/link';
import { formatPeriod, safeGetProjectType, safeGetCover, safeGetWorkType } from '@/lib/parse';
import type { ResultItem } from '@/types/results';

interface ResultCardProps {
  result: ResultItem;
  priority?: boolean;
  disableLink?: boolean; // リンクを無効化するオプション
}

export default function ResultCard({ result, priority = false, disableLink = false }: ResultCardProps) {
  const { id, title, summary, period } = result;

  const workType = safeGetWorkType(result);
  const projectType = safeGetProjectType(result);
  const cover = safeGetCover(result, true); // 一覧ページではOGP画像を使用

  return (
    <article className="result-card">
      {disableLink ? (
        <div className="result-card__link">
          <div className="result-card__image">
            <Image src={cover.url} alt={`${title}のカバー画像`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="result-card__image-img" priority={priority} />

            {/* オーバーレイ */}
            <div className="result-card__overlay"></div>

            {/* バッジ */}
            <div className="result-card__badge">
              <span className={`result-card__work-type work-type-${workType}`}>{workType}</span>
            </div>

            {/* ホバー時のアクション（リンク無効時は非表示） */}
            {/* <div className="result-card__action-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div> */}
          </div>

          <div className="result-card__content">
            <div className="result-card__meta">
              <span className="result-card__category">{projectType}</span>
              <span className="result-card__period">{formatPeriod(period)}</span>
            </div>

            <h3 className="result-card__title">{title}</h3>

            <p className="result-card__summary">{summary}</p>
          </div>
        </div>
      ) : (
        <Link href={`/results/${id}`} className="result-card__link">
          <div className="result-card__image">
            <Image src={cover.url} alt={`${title}のカバー画像`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="result-card__image-img" priority={priority} />

            {/* オーバーレイ */}
            <div className="result-card__overlay"></div>

            {/* バッジ */}
            <div className="result-card__badge">
              <span className={`result-card__work-type work-type-${workType}`}>{workType}</span>
            </div>

            {/* ホバー時のアクション */}
            <div className="result-card__action-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>

          <div className="result-card__content">
            <div className="result-card__meta">
              <span className="result-card__category">{projectType}</span>
              <span className="result-card__period">{formatPeriod(period)}</span>
            </div>

            <h3 className="result-card__title">{title}</h3>

            <p className="result-card__summary">{summary}</p>
          </div>
        </Link>
      )}
    </article>
  );
}
