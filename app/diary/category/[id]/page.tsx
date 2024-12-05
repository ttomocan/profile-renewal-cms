import { getCategoryDetail, getBlogList } from '@/app/_libs/microcms';
import { notFound } from 'next/navigation';
import BlogList from '@/app/_components/BlogList';
import Pagination from '@/app/_components/Pagination';
import Category from '@/app/_components/Category';
import { DIARY_LIST_LIMIT } from '@/app/_constants';
import styles from './page.module.css';

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

  return (
    <>
      <section className="l-inner">
        <h2 className={styles.category_title}>
          <Category category={category} /> の一覧
        </h2>
        <BlogList blog={blog} />
        <Pagination totalCount={totalCount} basePath={`/diary/category/${category.id}`} />
      </section>
    </>
  );
}
