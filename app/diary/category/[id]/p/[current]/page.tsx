import { notFound } from 'next/navigation';
import { getCategoryDetail, getBlogList } from '@/app/_libs/microcms';
import DiaryList from '@/app/_components/DiaryList';
import Pagination from '@/app/_components/Pagination';
import { DIARY_LIST_LIMIT } from '@/app/_constants';

type Props = {
  params: {
    current: string;
    id: string;
  };
};

export default async function Page({ params }: Props) {
  const current = parseInt(params.current as string, 10);

  if (Number.isNaN(current) || current < 1) {
    notFound();
  }

  const category = await getCategoryDetail(params.id).catch(notFound);

  const { contents: blog, totalCount } = await getBlogList({
    filters: `category[equals]${category.id}`,
    limit: DIARY_LIST_LIMIT,
    offset: DIARY_LIST_LIMIT * (current - 1),
  });

  if (blog.length === 0) {
    notFound();
  }

  return (
    <>
      <DiaryList blog={blog} />
      <Pagination totalCount={totalCount} current={current} basePath={`/diary/category/${category.id}`} />
    </>
  );
}
