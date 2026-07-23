import Image from 'next/image';
import Link from 'next/link';
import { formatPeriod, parseRoles, parseTechStack, safeGetProjectType, safeGetCover, safeGetWorkType } from '@/lib/parse';
import { createMetaDescription } from '@/lib/seo';
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
  const roles = parseRoles(result).slice(0, 2);
  const technologies = parseTechStack(result.techStack).slice(0, 4);
  const cardSummary = createMetaDescription(summary, 90);

  const cardContent = (
    <>
      <div className="result-card__image">
        <Image src={cover.url} alt={`${title}のカバー画像`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="result-card__image-img" priority={priority} />
        <div className="result-card__overlay"></div>
        <div className="result-card__badge">
          <span className={`result-card__work-type work-type-${workType}`}>{workType}</span>
        </div>
        {!disableLink && (
          <div className="result-card__action-icon" aria-hidden="true">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        )}
      </div>
      <div className="result-card__content">
        <div className="result-card__meta">
          <span className="result-card__category">{projectType}</span>
          <span className="result-card__period">{formatPeriod(period)}</span>
        </div>
        <h3 className="result-card__title">{title}</h3>
        {roles.length > 0 && <p className="result-card__responsibility">担当：{roles.join(' / ')}</p>}
        {technologies.length > 0 && (
          <ul className="result-card__technologies" aria-label="使用技術">
            {technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        )}
        <p className="result-card__summary">{cardSummary}</p>
        {!disableLink && <span className="result-card__detail-text">この制作実績を見る</span>}
      </div>
    </>
  );

  return (
    <article className="result-card fadeUpTrigger">
      {disableLink ? (
        <div className="result-card__link">{cardContent}</div>
      ) : (
        <Link href={`/result/${id}/`} className="result-card__link" aria-label={`${title}の制作実績を見る`}>
          {cardContent}
        </Link>
      )}
    </article>
  );
}
