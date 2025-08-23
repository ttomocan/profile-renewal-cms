import { getCategoryDetail, getBlogList } from '@/app/_libs/microcms';
import { notFound } from 'next/navigation';
import DiaryList from '@/app/_components/DiaryList';
import Pagination from '@/app/_components/Pagination';
import Category from '@/app/_components/Category';
import { DIARY_LIST_LIMIT } from '@/app/_constants';
import styles from './page.module.css';
import Breadcrumb from '@/app/_components/Breadcrumb';

type Props = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const category = await getCategoryDetail(params.id).catch(notFound);

  const { contents: blog, totalCount } = await getBlogList({
    limit: DIARY_LIST_LIMIT,
    filters: `category[equals]${category.id}`,
  });

  const breadcrumbItems = [
    { label: 'ホーム', href: '/' },
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
    </>
  );
}
