import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getResultDetail } from '@/app/_libs/microcms';
import { parseTechStack, splitHighlights, formatPeriod, safeGetProjectType, safeGetRoles, safeGetClientName, safeGetCover, safeGetWorkType } from '@/lib/parse';

interface ResultDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ResultDetailPageProps): Promise<Metadata> {
  const result = await getResultDetail(params.id);

  if (!result) {
    return {
      title: '実績が見つかりません',
    };
  }

  const siteName = 'ともきゃんスタイル';

  return {
    title: `${result.title} | 実績詳細 | ${siteName}`,
    description: result.summary,
    openGraph: {
      title: `${result.title} | ${siteName}`,
      description: result.summary,
      type: 'article',
      images: result.cover
        ? [
            {
              url: result.cover.url,
              width: result.cover.width,
              height: result.cover.height,
              alt: `${result.title}のカバー画像`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${result.title} | ${siteName}`,
      description: result.summary,
      images: result.cover ? [result.cover.url] : undefined,
    },
  };
}

export default async function ResultDetailPage({ params }: ResultDetailPageProps) {
  const result = await getResultDetail(params.id);

  if (!result) {
    notFound();
  }

  const { title, summary, period, techStack, highlights, testimonial, kpi, siteUrl, publishedAt } = result;

  // 安全な取得関数を使用
  const workType = safeGetWorkType(result);
  const projectType = safeGetProjectType(result);
  const roles = safeGetRoles(result);
  const clientName = safeGetClientName(result.clientName);
  const cover = safeGetCover(result);

  const techStackArray = parseTechStack(techStack);
  const highlightsArray = splitHighlights(highlights);
  const formattedPeriod = formatPeriod(period);

  const publishedDate = new Date(publishedAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="results-main">
      <div className="results-inner">
        {/* パンくずリスト */}
        <nav className="result-detail__breadcrumb" aria-label="パンくずリスト">
          <ol>
            <li>
              <Link href="/">ホーム</Link>
            </li>
            <li>
              <Link href="/results">実績一覧</Link>
            </li>
            <li>{title}</li>
          </ol>
        </nav>

        {/* メインコンテンツ */}
        <article className="result-detail">
          {/* ヘッダー */}
          <header className="result-detail__header">
            <div className="result-detail__header-badges">
              <span className="badge badge--work-type">{workType}</span>
              <span className="badge badge--project-type">{projectType}</span>
              <span className="badge badge--period">制作期間: {formattedPeriod}</span>
            </div>

            <h1 className="result-detail__header-title">{title}</h1>

            <div className="result-detail__header-meta">
              <time dateTime={publishedAt}>公開日: {publishedDate}</time>
              <span>クライアント: {clientName}</span>
            </div>
          </header>

          {/* カバー画像 */}
          <div className="result-detail__cover">
            <div className="result-detail__cover-container">
              <Image src={cover.url} alt={`${title}のカバー画像`} fill sizes="(max-width: 768px) 100vw, 896px" className="object-cover" priority />
            </div>
          </div>

          {/* 概要 */}
          <section className="result-detail__section">
            <h2 className="result-detail__section-title">概要</h2>
            <div className="result-detail__section-content result-detail__section-content--summary">
              <p>{summary}</p>
            </div>
          </section>

          {/* 担当範囲 */}
          {roles && roles !== '未分類' && (
            <section className="result-detail__section">
              <h2 className="result-detail__section-title">担当範囲</h2>
              <div className="result-detail__section-content result-detail__section-content--summary">
                <div className="info-block__tags">
                  <span className="tag tag--role">{roles}</span>
                </div>
              </div>
            </section>
          )}

          {/* 使用技術 */}
          {techStackArray.length > 0 && (
            <section className="result-detail__section">
              <h2 className="result-detail__section-title">使用技術</h2>
              <div className="result-detail__section-content result-detail__section-content--summary">
                <div className="info-block__tags">
                  {techStackArray.map((tech, index) => (
                    <span key={index} className="tag tag--tech">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 工夫したポイント */}
          {highlightsArray.length > 0 && (
            <section className="result-detail__section">
              <h2 className="result-detail__section-title">工夫したポイント</h2>
              <div className="result-detail__section-content result-detail__section-content--summary">
                <ul className="result-detail__section-highlights">
                  {highlightsArray.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* 成果・KPI */}
          {kpi && kpi.trim() && (
            <section className="result-detail__section">
              <h2 className="result-detail__section-title">成果・効果</h2>
              <div className="result-detail__section-content result-detail__section-content--summary">
                <p>{kpi}</p>
              </div>
            </section>
          )}

          {/* お客様の声 */}
          {testimonial && testimonial.trim() && (
            <section className="result-detail__section">
              <h2 className="result-detail__section-title">お客様の声</h2>
              <div className="result-detail__section-content result-detail__section-content--summary">
                <blockquote>&ldquo;{testimonial}&rdquo;</blockquote>
                <cite>― {clientName} 様</cite>
              </div>
            </section>
          )}

          {/* サイトリンク */}
          {siteUrl && siteUrl.trim() && (
            <section className="result-detail__section">
              <h2 className="result-detail__section-title">サイト</h2>
              <div className="result-detail__section-content result-detail__section-content--summary">
                <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="site-link">
                  <span>サイトを見る</span>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </section>
          )}
        </article>

        {/* ナビゲーション */}
        <nav className="result-detail__navigation">
          <div className="result-detail__navigation-content">
            <Link href="/results" className="result-detail__navigation-back">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              実績一覧に戻る
            </Link>

            <div className="result-detail__navigation-label">実績詳細</div>
          </div>
        </nav>
      </div>
    </main>
  );
}
