import { getBlogList } from '@/app/_libs/microcms';
import { DIARY_LIST_LIMIT } from '@/app/_constants';
import DiaryList from '@/app/_components/DiaryList';
import SearchField from '@/app/_components/SearchField';

type Props = {
  searchParams: {
    q?: string;
  };
};

export default async function Page({ searchParams }: Props) {
  const { contents: blog } = await getBlogList({
    limit: DIARY_LIST_LIMIT,
    q: searchParams.q,
  });

  return (
    <>
      <section className="l-inner">
        <SearchField />
        <DiaryList blog={blog} />
      </section>
    </>
  );
}
