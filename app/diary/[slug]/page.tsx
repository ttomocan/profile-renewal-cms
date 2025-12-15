import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBlogDetail } from '@/app/_libs/microcms';
import Article from '@/app/_components/Article';
import Link from 'next/link';
import styles from './page.module.css';
import BlogPostJsonLd from '@/app/_components/BlogPostJsonLd';
import BreadcrumbListJsonLd from '@/app/_components/BreadcrumbListJsonLd';

type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    dk?: string;
  }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const data = await getBlogDetail(resolvedParams.slug, {
    draftKey: resolvedSearchParams.dk,
  });
  const baseImageUrl = data.thumbnail?.url ?? '/img/common/ogp.png';

  const version = encodeURIComponent(data.revisedAt ?? data.publishedAt ?? Date.now());
  const imageUrl = `${baseImageUrl}?v=${version}`;

  return {
    title: data.title,
    description: data.description,
    alternates: {
      canonical: `https://www.tomocan.site/diary/${resolvedParams.slug}/`,
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url: `https://www.tomocan.site/diary/${resolvedParams.slug}/`,
      images: [imageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@t_tomocan',
      title: data.title,
      description: data.description,
      images: [imageUrl],
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const data = await getBlogDetail(resolvedParams.slug, {
    draftKey: resolvedSearchParams.dk,
  }).catch(notFound);

  const pageUrl = `https://www.tomocan.site/diary/${resolvedParams.slug}`;

  const breadcrumbItems = [
    { label: 'トップ', href: '/' },
    { label: 'ともきゃん日記', href: '/diary/' },
    { label: data.title, active: true },
  ];

  return (
    <>
      <article className="inner">
        <Article data={data} />
        <div className={styles.footer}>
          <Link href="/diary/" className={'c-button__link --return'}>
            日記一覧へ
          </Link>
        </div>
      </article>
      <BlogPostJsonLd blog={data} url={pageUrl} />
      <BreadcrumbListJsonLd items={breadcrumbItems} />
    </>
  );
}
