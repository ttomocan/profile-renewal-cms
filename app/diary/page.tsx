import { getBlogList } from '@/app/_libs/microcms';
import BlogList from '@/app/_components/DiaryList';
import Pagination from '@/app/_components/Pagination';
import SearchField from '@/app/_components/SearchField';
import { DIARY_LIST_LIMIT } from '@/app/_constants';

export default async function Page() {
  const { contents: blog, totalCount } = await getBlogList({
    limit: DIARY_LIST_LIMIT,
  });

  return (
    <>
      <section className="l-inner">
        <SearchField />
        <BlogList blog={blog} />
        <Pagination totalCount={totalCount} />
      </section>
    </>
  );
}
