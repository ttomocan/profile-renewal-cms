import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBlogDetail } from '@/app/_libs/microcms';
import Article from '@/app/_components/Article';
import Link from 'next/link';
import styles from './page.module.css';

type Props = {
  params: {
    slug: string;
  };
  searchParams: {
    dk?: string;
  };
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const data = await getBlogDetail(params.slug, {
    draftKey: searchParams.dk,
  });

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      images: [data?.thumbnail?.url ?? ''],
    },
  };
}

export default async function Page({ params, searchParams }: Props) {
  const data = await getBlogDetail(params.slug, {
    draftKey: searchParams.dk,
  }).catch(notFound);

  return (
    <>
      <article className="l-inner">
        <Article data={data} />
        <div className={styles.footer}>
          <Link href="/diary/" className={'c-button__link --return'}>
            日記一覧へ
          </Link>
        </div>
      </article>
    </>
  );
}
