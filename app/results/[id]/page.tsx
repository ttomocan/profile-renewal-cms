import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getResultDetail } from '@/app/_libs/microcms';
import { parseTechStack, parseRoles, splitHighlights, formatPeriod, safeGetProjectType, safeGetRoles, safeGetClientName, safeGetWorkType, safeGetCover, safeGetScale } from '@/lib/parse';
import { getFaviconUrl } from '@/lib/favicon';
import PageTitle from '@/app/_components/PageTitle';
import Breadcrumb from '@/app/_components/Breadcrumb';
import '@/styles/pages/results.scss';

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

  const { title, summary, period, techStack, highlights, testimonial, kpi, siteUrl, scale } = result;

  // 安全な取得関数を使用
  const workType = safeGetWorkType(result);
  const projectType = safeGetProjectType(result);
  const roles = safeGetRoles(result);
  const clientName = safeGetClientName(result.clientName);
  const cover = safeGetCover(result); // サイトカードで使用
  const safeScale = safeGetScale(result);

  const techStackArray = parseTechStack(techStack);
  const rolesArray = parseRoles(result);
  const highlightsArray = splitHighlights(highlights);
  const formattedPeriod = formatPeriod(period);

  const breadcrumbItems = [
    { label: 'ホーム', href: '/' },
    { label: '実績紹介', href: '/results/' },
    { label: title, active: true },
  ];

  return (
    <>
      {/* ページタイトル */}
      <PageTitle title="Results" sub="実績紹介" />

      {/* パンくずリスト */}
      <Breadcrumb items={breadcrumbItems} />

      <main className="results-main">
        <div className="results-inner">
          {/* メインコンテンツ */}
          <article className="result-detail">
            {/* ヘッダー */}
            <header className="result-detail__header">
              <div className="result-detail__header-badges">
                <span className="badge badge--work-type">{workType}</span>
                <span className="badge badge--project-type">{projectType}</span>
              </div>

              <h1 className="result-detail__header-title">{title}</h1>

              <div className="result-detail__header-meta">
                <span>
                  <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  制作期間: {formattedPeriod}
                </span>
                {safeScale && safeScale !== '未分類' && (
                  <span>
                    <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v2M4 6v10a2 2 0 002 2h12a2 2 0 002-2V6M4 6h16M7 10h3m-3 4h8m-8 4h8" />
                    </svg>
                    プロジェクト規模: {safeScale}
                  </span>
                )}
                {result.clientName && result.clientName.trim() && (
                  <span>
                    <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    クライアント: {clientName}
                  </span>
                )}
              </div>
            </header>

            {/* カバー画像は非表示 */}

            {/* 概要 */}
            <section className="result-detail__section">
              <h2 className="result-detail__section-title">概要</h2>
              <div className="result-detail__section-content result-detail__section-content--summary">
                <p>{summary}</p>
              </div>
            </section>

            {/* 担当範囲 */}
            {rolesArray.length > 0 && (
              <section className="result-detail__section">
                <h2 className="result-detail__section-title">担当範囲</h2>
                <div className="result-detail__section-content result-detail__section-content--tags">
                  <div className="tags-container">
                    {rolesArray.map((role, index) => (
                      <span key={index} className="tag tag--role">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 使用技術 */}
            {techStackArray.length > 0 && (
              <section className="result-detail__section">
                <h2 className="result-detail__section-title">使用技術</h2>
                <div className="result-detail__section-content result-detail__section-content--tags">
                  <div className="tags-container">
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
                  <div className="result-detail__section-highlights">
                    <ul>
                      {highlightsArray.map((highlight, index) => (
                        <li key={index}>
                          <span style={{ marginRight: '8px', color: '#f36b0a', fontWeight: 'bold' }}>▪</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
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
                  {result.clientName && result.clientName.trim() && <cite>― {clientName} 様</cite>}
                </div>
              </section>
            )}

            {/* サイトリンク */}
            {siteUrl && siteUrl.trim() && (
              <section className="result-detail__section">
                <h2 className="result-detail__section-title">サイトURL</h2>
                <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="site-link-card">
                  <div className="site-link-card__favicon">
                    <Image src={getFaviconUrl(siteUrl)} alt={`${title}のファビコン`} width={64} height={64} unoptimized={true} />
                  </div>
                  <div className="site-link-card__content">
                    <div className="site-link-card__header">
                      <h3 className="site-link-card__title">{title}</h3>
                      <div className="site-link-card__action">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </div>
                    <div className="site-link-card__url">{siteUrl}</div>
                  </div>
                </a>
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
                実績紹介に戻る
              </Link>
            </div>
          </nav>
        </div>
      </main>
    </>
  );
}
