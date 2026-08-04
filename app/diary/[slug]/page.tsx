import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogDetail, getBlogList, getResults } from '@/app/_libs/microcms';
import Article from '@/app/_components/Article';
import Breadcrumb from '@/app/_components/Breadcrumb';
import BlogPostJsonLd from '@/app/_components/BlogPostJsonLd';
import BreadcrumbListJsonLd from '@/app/_components/BreadcrumbListJsonLd';
import { createMetadata } from '@/lib/seo';
import { getBlogSeoDescription, getBlogSeoTitle } from '@/lib/contentSeo';
import { parseTechStack } from '@/lib/parse';
import styles from './page.module.css';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ dk?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const data = await getBlogDetail(resolvedParams.slug, { draftKey: resolvedSearchParams.dk });
  const title = getBlogSeoTitle(data);
  const description = getBlogSeoDescription(data);

  return createMetadata({
    title,
    description,
    path: `/diary/${resolvedParams.slug}/`,
    type: 'article',
    image: data.thumbnail?.url,
    imageAlt: data.thumbnailAlt?.trim() || `${data.title}のアイキャッチ画像`,
    noindex: Boolean(resolvedSearchParams.dk),
  });
}

export default async function Page({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const data = await getBlogDetail(resolvedParams.slug, { draftKey: resolvedSearchParams.dk }).catch(notFound);
  const technicalSource = `${data.title} ${data.description}`;
  const technicalArticle = /(Web|WordPress|Next\.js|React|TypeScript|JavaScript|CSS|CMS|SEO|UI|アプリ|開発|制作)/i.test(technicalSource);
  const [relatedData, resultData] = await Promise.all([
    getBlogList({ limit: 4, filters: `category[equals]${data.category.id}` }),
    technicalArticle ? getResults({ limit: 24, sort: 'new' }) : Promise.resolve({ contents: [] }),
  ]);
  const relatedArticles = relatedData.contents.filter((article) => article.id !== data.id).slice(0, 3);
  const pageUrl = `https://www.tomocan.site/diary/${resolvedParams.slug}/`;
  const articleKeywords = ['WordPress', 'Next.js', 'React', 'TypeScript', 'JavaScript', 'CSS', 'CMS', 'SEO', 'UI'].filter((keyword) => technicalSource.toLowerCase().includes(keyword.toLowerCase()));
  const relatedResults = resultData.contents
    .filter((result) => {
      const resultText = `${result.title} ${result.summary} ${parseTechStack(result.techStack).join(' ')}`.toLowerCase();
      return articleKeywords.some((keyword) => resultText.includes(keyword.toLowerCase()));
    })
    .slice(0, 3);

  const breadcrumbItems = [
    { label: 'トップ', href: '/' },
    { label: 'ともきゃん日記', href: '/diary/' },
    { label: data.title, active: true },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <article className="inner">
        <Article data={data} />

        {relatedArticles.length > 0 && (
          <section className={styles.related} aria-labelledby="related-articles-heading">
            <h2 id="related-articles-heading">同じカテゴリーの関連記事</h2>
            <ul>
              {relatedArticles.map((article) => (
                <li key={article.id}>
                  <Link href={`/diary/${article.id}/`}>{article.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className={styles.related} aria-labelledby="related-pages-heading">
          <h2 id="related-pages-heading">関連ページ</h2>
          <ul>
            {relatedResults.map((result) => (
              <li key={result.id}>
                <Link href={`/result/${result.id}/`}>{result.title}の制作実績を見る</Link>
              </li>
            ))}
            {technicalArticle && (
              <>
                <li>
                  <Link href="/skill/">実務・個人開発の対応スキルを見る</Link>
                </li>
                <li>
                  <Link href="/result/">Web制作実績を見る</Link>
                </li>
              </>
            )}
            <li>
              <Link href="/about/">ともきゃんのプロフィール・経歴を見る</Link>
            </li>
          </ul>
        </section>

        <div className={styles.footer}>
          <Link href="/diary/" className="c-button__link --return">
            活動記録の一覧へ
          </Link>
        </div>
      </article>
      <BlogPostJsonLd blog={data} url={pageUrl} />
      <BreadcrumbListJsonLd items={breadcrumbItems} />
    </>
  );
}
