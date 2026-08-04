import { notFound, permanentRedirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getCategoryDetail, getBlogList } from '@/app/_libs/microcms';
import DiaryList from '@/app/_components/DiaryList';
import Pagination from '@/app/_components/Pagination';
import Breadcrumb from '@/app/_components/Breadcrumb';
import BreadcrumbListJsonLd from '@/app/_components/BreadcrumbListJsonLd';
import { DIARY_LIST_LIMIT } from '@/app/_constants';
import { createMetadata } from '@/lib/seo';
import { parseStrictPageNumber } from '@/lib/parse';

type Props = {
  params: Promise<{
    current: string;
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const current = parseStrictPageNumber(resolvedParams.current);
  const [category, categoryPosts] = await Promise.all([
    getCategoryDetail(resolvedParams.id).catch(() => null),
    getBlogList({ limit: 1, filters: `category[equals]${resolvedParams.id}` }).catch(() => null),
  ]);

  if (!current || current === 1 || !category || !categoryPosts) {
    return createMetadata({ title: 'カテゴリーページが見つかりません', description: '指定されたカテゴリーの一覧ページは存在しません。', path: `/diary/category/${resolvedParams.id}/p/${resolvedParams.current}/`, noindex: true });
  }

  const title = `${category.name}の記事 ${current}ページ目｜ともきゃん日記`;
  const description = `「${category.name}」カテゴリーの記事一覧 ${current}ページ目。ともきゃん日記から${category.name}に関する記事をご覧いただけます。`;

  return createMetadata({
    title,
    description,
    path: `/diary/category/${resolvedParams.id}/p/${current}/`,
    noindex: categoryPosts.totalCount < 3,
  });
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const current = parseStrictPageNumber(resolvedParams.current);

  if (!current) notFound();
  if (current === 1) permanentRedirect(`/diary/category/${resolvedParams.id}/`);

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
