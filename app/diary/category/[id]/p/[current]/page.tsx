import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCategoryDetail, getBlogList } from '@/app/_libs/microcms';
import DiaryList from '@/app/_components/DiaryList';
import Pagination from '@/app/_components/Pagination';
import Breadcrumb from '@/app/_components/Breadcrumb';
import BreadcrumbListJsonLd from '@/app/_components/BreadcrumbListJsonLd';
import { DIARY_LIST_LIMIT } from '@/app/_constants';

type Props = {
  params: Promise<{
    current: string;
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const current = parseInt(resolvedParams.current, 10);
  const category = await getCategoryDetail(resolvedParams.id).catch(() => null);

  if (!category) {
    return {
      title: 'カテゴリーが見つかりません',
    };
  }

  const title = `${category.name}の記事 ${current}ページ目｜ともきゃん日記`;
  const description = `「${category.name}」カテゴリーの記事一覧 ${current}ページ目。ともきゃん日記から${category.name}に関する記事をご覧いただけます。`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.tomocan.site/diary/category/${resolvedParams.id}/p/${current}/`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.tomocan.site/diary/category/${resolvedParams.id}/p/${current}/`,
      type: 'website',
      images: ['/img/common/ogp.png'],
      siteName: 'ともきゃんスタイル',
      locale: 'ja_JP',
    },
    twitter: {
      title,
      description,
      card: 'summary_large_image',
      images: ['/img/common/ogp.png'],
    },
  };
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const current = parseInt(resolvedParams.current, 10);

  if (Number.isNaN(current) || current < 1) {
    notFound();
  }

  const category = await getCategoryDetail(resolvedParams.id).catch(notFound);

  const { contents: blog, totalCount } = await getBlogList({
    filters: `category[equals]${category.id}`,
    limit: DIARY_LIST_LIMIT,
    offset: DIARY_LIST_LIMIT * (current - 1),
  });

  if (blog.length === 0) {
    notFound();
  }

  const breadcrumbItems = [
    { label: 'トップ', href: '/' },
    { label: 'ともきゃん日記', href: '/diary/' },
    { label: `${category.name}の記事`, href: `/diary/category/${category.id}/` },
    { label: `${current}ページ目`, active: true },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <section className="inner">
        <h1 className="diary-archive-title">{category.name}の記事（{current}ページ目）</h1>
        <h2 className="u-visually-hidden">{category.name}カテゴリーの記事一覧</h2>
        <DiaryList blog={blog} />
        <Pagination totalCount={totalCount} current={current} basePath={`/diary/category/${category.id}`} />
      </section>
      <BreadcrumbListJsonLd items={breadcrumbItems} />
    </>
  );
}
