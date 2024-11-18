import { getNewsDetail } from '@/app/_libs/microcms';
import Article from '@/app/_components/Article';
import ButtonLink from '@/app/_components/ButtonLink';
import styles from './page.module.css';

type Props = {
	params: {
		slug: string;
	};
};

export async function generateMetadata({ params }: Props) {
	const data = await getNewsDetail(params.slug);

	return (
		<>
			<Article data={data} />
			<div className={styles.footer}>
				<ButtonLink href='/news'>ニュース一覧へ</ButtonLink>
			</div>
		</>
	);
}
