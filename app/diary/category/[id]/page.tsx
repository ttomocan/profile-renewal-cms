import { getCategoryDetail, getBlogList } from '@/app/_libs/microcms';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import DiaryList from '@/app/_components/DiaryList';
import Pagination from '@/app/_components/Pagination';
import Category from '@/app/_components/Category';
import { DIARY_LIST_LIMIT } from '@/app/_constants';
import styles from './page.module.css';
import Breadcrumb from '@/app/_components/Breadcrumb';
import BreadcrumbListJsonLd from '@/app/_components/BreadcrumbListJsonLd';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await getCategoryDetail(resolvedParams.id).catch(() => null);

  if (!category) {
    return {
      title: 'カテゴリーが見つかりません',
    };
  }

  const title = `${category.name}の記事一覧`;
  const description = `「${category.name}」カテゴリーの記事一覧。ともきゃん日記から${category.name}に関する記事をご覧いただけます。`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.tomocan.site/diary/category/${resolvedParams.id}/`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.tomocan.site/diary/category/${resolvedParams.id}/`,
    },
    twitter: {
      title,
      description,
    },
  };
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const category = await getCategoryDetail(resolvedParams.id).catch(notFound);

  const { contents: blog, totalCount } = await getBlogList({
    limit: DIARY_LIST_LIMIT,
    filters: `category[equals]${category.id}`,
  });

  const breadcrumbItems = [
    { label: 'トップ', href: '/' },
    { label: 'ともきゃん日記', href: '/diary/' },
    { label: `${category.name}の記事`, active: true },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <section className="inner">
        <h2 className={styles.category_title}>
          <Category category={category} /> の一覧
        </h2>
        <DiaryList blog={blog} />
        <Pagination totalCount={totalCount} basePath={`/diary/category/${category.id}`} />
      </section>
      <BreadcrumbListJsonLd items={breadcrumbItems} />
    </>
  );
}
