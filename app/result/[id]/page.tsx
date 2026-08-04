import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogList, getResultDetail, getResults } from '@/app/_libs/microcms';
import { parseTechStack, parseRoles, splitHighlights, formatPeriod, safeGetProjectType, safeGetRoles, safeGetClientName, safeGetWorkType, safeGetCover, safeGetScale } from '@/lib/parse';
import { getFaviconUrl } from '@/lib/favicon';
import PageTitle from '@/app/_components/PageTitle';
import Breadcrumb from '@/app/_components/Breadcrumb';
import BreadcrumbListJsonLd from '@/app/_components/BreadcrumbListJsonLd';
import ResultJsonLd from '@/app/_components/ResultJsonLd';
import ResultCard from '@/components/ResultCard';
import { createMetadata } from '@/lib/seo';
import { getResultSeoDescription, getResultSeoTitle } from '@/lib/contentSeo';
import '@/styles/pages/result.scss';

interface ResultDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ResultDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const result = await getResultDetail(resolvedParams.id);

  if (!result) {
    return {
      title: '実績が見つかりません',
    };
  }

  const title = getResultSeoTitle(result);
  const description = getResultSeoDescription(result);

  return createMetadata({
    title,
    description,
    path: `/result/${resolvedParams.id}/`,
    type: 'article',
    image: result.cover?.url,
    imageAlt: result.coverAlt?.trim() || `${result.title}の制作実績`,
  });
}

function TextSection({ title, value }: { title: string; value?: string }) {
  if (!value?.trim()) return null;

  return (
    <section className="result-detail__section">
      <h2 className="result-detail__section-title">{title}</h2>
      <div className="result-detail__section-content result-detail__section-content--summary">
        {value
          .split(/\n{2,}/)
          .map((paragraph) => paragraph.trim())
          .filter(Boolean)
          .map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
      </div>
    </section>
  );
}

export default async function ResultDetailPage({ params }: ResultDetailPageProps) {
  const resolvedParams = await params;
  const result = await getResultDetail(resolvedParams.id);

  if (!result) {
    notFound();
  }

  const { title, summary, period, techStack, highlights, testimonial, kpi, siteUrl, challenge, constraints, responsibility, decisions, results: projectResults, outOfScope } = result;

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

  const relatedArticleKeyword = ['WordPress', 'SEO', 'CMS', 'JavaScript', 'CSS'].find((keyword) => `${techStack ?? ''} ${highlights ?? ''}`.toLowerCase().includes(keyword.toLowerCase()));
  const [relatedData, relatedBlogData] = await Promise.all([
    getResults({ limit: 24, sort: 'new' }),
    relatedArticleKeyword ? getBlogList({ limit: 4, q: relatedArticleKeyword }) : Promise.resolve({ contents: [] }),
  ]);
  const currentTechnologies = new Set(techStackArray.map((technology) => technology.toLowerCase()));
  const relatedResults = relatedData.contents
    .filter((item) => item.id !== result.id)
    .map((item) => {
      const sharedTechnologies = parseTechStack(item.techStack).filter((technology) => currentTechnologies.has(technology.toLowerCase())).length;
      const sameProjectType = safeGetProjectType(item) === projectType && projectType !== '未分類' ? 3 : 0;
      const sameWorkType = safeGetWorkType(item) === workType && workType !== '未分類' ? 1 : 0;
      return { item, score: sharedTechnologies + sameProjectType + sameWorkType };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item }) => item);
  const relatedArticles = relatedBlogData.contents.slice(0, 3);
  const contactTopics = [...rolesArray, ...techStackArray].slice(0, 4).join('、');

  const breadcrumbItems = [
    { label: 'トップ', href: '/' },
    { label: '実績紹介', href: '/result/' },
    { label: title, active: true },
  ];

  return (
    <>
      {/* ページタイトル */}
      <PageTitle title="Result" sub="実績紹介" isHeading={false} />

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

              <dl className="result-detail__header-meta">
                <div>
                  <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <dt>制作期間</dt>
                  <dd>{formattedPeriod}</dd>
                </div>
                {safeScale && safeScale !== '未分類' && (
                  <div>
                    <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v2M4 6v10a2 2 0 002 2h12a2 2 0 002-2V6M4 6h16M7 10h3m-3 4h8m-8 4h8" />
                    </svg>
                    <dt>プロジェクト規模</dt>
                    <dd>{safeScale}</dd>
                  </div>
                )}
                {result.clientName && result.clientName.trim() && (
                  <div>
                    <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <dt>クライアント</dt>
                    <dd>{clientName}</dd>
                  </div>
                )}
              </dl>
            </header>

            {/* カバー画像は非表示 */}

            {/* 概要 */}
            <section className="result-detail__section">
              <h2 className="result-detail__section-title">案件概要</h2>
              <div className="result-detail__section-content result-detail__section-content--summary">
                <p>{summary}</p>
              </div>
            </section>

            <TextSection title="課題・背景" value={challenge} />
            <TextSection title="制約条件" value={constraints} />

            {/* 担当範囲 */}
            {(responsibility?.trim() || rolesArray.length > 0) && (
              <section className="result-detail__section">
                <h2 className="result-detail__section-title">自分が担当した範囲</h2>
                <div className="result-detail__section-content">
                  {responsibility?.trim() && <p>{responsibility}</p>}
                  {rolesArray.length > 0 && (
                    <div className="tags-container" role="list" aria-label="担当範囲一覧">
                      {rolesArray.map((role) => (
                        <span key={role} className="tag tag--role" role="listitem">
                          {role}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* 使用技術 */}
            {techStackArray.length > 0 && (
              <section className="result-detail__section">
                <h2 className="result-detail__section-title">使用技術</h2>
                <div className="result-detail__section-content result-detail__section-content--tags">
                  <div className="tags-container" role="list" aria-label="使用技術一覧">
                    {techStackArray.map((tech, index) => (
                      <span key={index} className="tag tag--tech" role="listitem" aria-label={`使用技術: ${tech}`}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 実装・判断したこと */}
            {(decisions?.trim() || highlightsArray.length > 0) && (
              <section className="result-detail__section">
                <h2 className="result-detail__section-title">実装・判断したこと</h2>
                <div className="result-detail__section-content result-detail__section-content--summary">
                  {decisions?.trim() ? (
                    <p>{decisions}</p>
                  ) : (
                    <div className="result-detail__section-highlights">
                      <ul>
                        {highlightsArray.map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            <TextSection title="改善結果・成果" value={projectResults?.trim() || kpi} />
            <TextSection title="担当外の範囲" value={outOfScope} />

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
                <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="site-link-card" aria-label={`${title}の公開サイトを新しいタブで開く`}>
                  <div className="site-link-card__favicon">
                    <Image src={getFaviconUrl(siteUrl)} alt="" width={64} height={64} unoptimized={true} />
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

            {relatedResults.length > 0 && (
              <section className="result-detail__section result-related">
                <h2 className="result-detail__section-title">関連する制作実績</h2>
                <div className="results-grid">
                  {relatedResults.map((relatedResult) => (
                    <ResultCard key={relatedResult.id} result={relatedResult} />
                  ))}
                </div>
              </section>
            )}

            {relatedArticles.length > 0 && (
              <section className="result-detail__section result-related-navigation">
                <h2 className="result-detail__section-title">関連する技術記事</h2>
                <ul className="result-related-links">
                  {relatedArticles.map((article) => (
                    <li key={article.id}>
                      <Link href={`/diary/${article.id}/`}>{article.title}</Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="result-detail__section result-related-navigation">
              <h2 className="result-detail__section-title">関連ページ</h2>
              <ul className="result-related-links">
                <li>
                  <Link href="/result/">Web制作実績をすべて見る</Link>
                </li>
                <li>
                  <Link href="/skill/">実務・個人開発の対応スキルを見る</Link>
                </li>
                <li>
                  <Link href="/about/">プロフィール・経歴を見る</Link>
                </li>
              </ul>
            </section>

            <section className="result-detail__section result-contact" aria-labelledby="project-contact-heading">
              <h2 id="project-contact-heading" className="result-detail__section-title">
                採用・協業について相談する
              </h2>
              <div className="result-detail__section-content result-detail__section-content--summary">
                <p>{contactTopics ? `${contactTopics}に関する` : 'Web制作に関する'}採用・業務委託・協業のご相談を受け付けています。この制作実績について確認したい点がある場合も、内容を添えてご連絡ください。</p>
                <p className="result-contact__button">
                  <Link href="/contact/" className="c-button__link">
                    採用・協業について問い合わせる
                  </Link>
                </p>
              </div>
            </section>
          </article>

          {/* ナビゲーション */}
          <nav className="result-detail__navigation">
            <div className="result-detail__navigation-content">
              <Link href="/result/" className="result-detail__navigation-back">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                実績紹介に戻る
              </Link>
            </div>
          </nav>
        </div>
      </main>
      <ResultJsonLd result={result} />
      <BreadcrumbListJsonLd items={breadcrumbItems} />
    </>
  );
}
