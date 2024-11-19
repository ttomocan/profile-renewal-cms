import { getCategoryDetail, getNewsList } from '@/app/_libs/microcms';
import { notFound } from 'next/navigation';
import NewsList from '@/app/_components/NewsList';
import Category from '@/app/_components/Category';

type Props = {
	params: {
		id: string;
	};
};

export default async function Page({ params }: Props) {
	const category = await getCategoryDetail(params.id).catch(notFound);

	const { contents: news } = await getNewsList({
		filters: `category[equals]${category.id}`,
	});

	return (
		<>
			<p>
				<Category category={category} /> の一覧
			</p>
			<NewsList news={news} />
		</>
	);
}
