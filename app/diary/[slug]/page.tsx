import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogDetail, getBlogList } from '@/app/_libs/microcms';
import Article from '@/app/_components/Article';
import Breadcrumb from '@/app/_components/Breadcrumb';
import BlogPostJsonLd from '@/app/_components/BlogPostJsonLd';
import BreadcrumbListJsonLd from '@/app/_components/BreadcrumbListJsonLd';
import { createMetaDescription } from '@/lib/seo';
import styles from './page.module.css';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ dk?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const data = await getBlogDetail(resolvedParams.slug, { draftKey: resolvedSearchParams.dk });
  const title = `${data.title}｜ともきゃん日記`;
  const description = createMetaDescription(data.description);
  const image = data.thumbnail
    ? {
        url: data.thumbnail.url,
        width: data.thumbnail.width,
        height: data.thumbnail.height,
        alt: `${data.title}のアイキャッチ画像`,
      }
    : {
        url: '/img/common/ogp.png',
        width: 1200,
        height: 630,
        alt: 'ともきゃんスタイル',
      };

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.tomocan.site/diary/${resolvedParams.slug}/`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.tomocan.site/diary/${resolvedParams.slug}/`,
      type: 'article',
      images: [image],
      siteName: 'ともきゃんスタイル',
      locale: 'ja_JP',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@t_tomocan',
      title,
      description,
      images: [image.url],
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const data = await getBlogDetail(resolvedParams.slug, { draftKey: resolvedSearchParams.dk }).catch(notFound);
  const relatedData = await getBlogList({ limit: 4, filters: `category[equals]${data.category.id}` });
  const relatedArticles = relatedData.contents.filter((article) => article.id !== data.id).slice(0, 3);
  const pageUrl = `https://www.tomocan.site/diary/${resolvedParams.slug}/`;
  const technicalArticle = /(Web|WordPress|Next\.js|React|TypeScript|JavaScript|CSS|CMS|SEO|アプリ|開発|制作)/i.test(`${data.title} ${data.description} ${data.content}`);

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
