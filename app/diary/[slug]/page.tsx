import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getBlogDetail, getBlogList } from '@/app/_libs/microcms';
import Article from '@/app/_components/Article';
import Breadcrumb from '@/app/_components/Breadcrumb';
import BlogPostJsonLd from '@/app/_components/BlogPostJsonLd';
import BreadcrumbListJsonLd from '@/app/_components/BreadcrumbListJsonLd';
import { createMetadata } from '@/lib/seo';
import { returnNullOnMicroCMSNotFound } from '@/lib/microcmsErrors';
import { getBlogSeoDescription, getBlogSeoTitle } from '@/lib/contentSeo';
import DiaryList from '@/app/_components/DiaryList';
import styles from './page.module.css';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ dk?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const data = await getBlogDetail(resolvedParams.slug, { draftKey: resolvedSearchParams.dk }).catch(returnNullOnMicroCMSNotFound);
  if (!data) notFound();
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
  const data = await getBlogDetail(resolvedParams.slug, { draftKey: resolvedSearchParams.dk }).catch(returnNullOnMicroCMSNotFound);
  if (!data) notFound();
  const relatedData = await getBlogList({ limit: 4, filters: `category[equals]${data.category.id}` });
  const relatedArticles = relatedData.contents.filter((article) => article.id !== data.id).slice(0, 3);
  const pageUrl = `https://www.tomocan.site/diary/${resolvedParams.slug}/`;

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
            <DiaryList blog={relatedArticles} />
          </section>
        )}

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
