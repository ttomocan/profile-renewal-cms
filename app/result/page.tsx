import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { getBlogList, getResults } from '@/app/_libs/microcms';
import { RESULTS_LIST_LIMIT } from '@/app/_constants';
import ResultArchive from './_components/ResultArchive';
import { createMetadata } from '@/lib/seo';
import { parseStrictPageNumber } from '@/lib/parse';
import '@/styles/pages/result.scss';

const title = 'Web制作実績｜WordPress・CMS構築・UI改善｜ともきゃん';
const description = '本業・副業のWeb制作実績と個人開発「いろポン！」を紹介します。WordPress・CMS構築やフロントエンドの担当領域、案件固有の実装内容を各詳細ページで確認できます。';

export const metadata: Metadata = createMetadata({
  title,
  description,
  path: '/result/',
});

type Props = {
  searchParams: Promise<{ page?: string | string[] }>;
};

export default async function ResultsPage({ searchParams }: Props) {
  const { page } = await searchParams;

  if (page !== undefined) {
    if (Array.isArray(page)) notFound();
    const requestedPage = parseStrictPageNumber(page);
    if (!requestedPage) notFound();
    permanentRedirect(requestedPage === 1 ? '/result/' : `/result/p/${requestedPage}/`);
  }

  const [resultsData, personalData] = await Promise.all([
    getResults({ limit: RESULTS_LIST_LIMIT, offset: 0, sort: 'new' }),
    getBlogList({ ids: 'iropon-release', limit: 1, fields: 'id,title,description,thumbnail' }).catch(() => ({ contents: [] })),
  ]);
  return <ResultArchive currentPage={1} resultsData={resultsData} personalArticle={personalData.contents[0]} />;
}
