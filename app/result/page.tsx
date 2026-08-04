import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { getResults } from '@/app/_libs/microcms';
import { RESULTS_LIST_LIMIT } from '@/app/_constants';
import ResultArchive from './_components/ResultArchive';
import { createMetadata } from '@/lib/seo';
import { parseStrictPageNumber } from '@/lib/parse';
import '@/styles/pages/result.scss';

const title = 'Web制作実績｜WordPress・CMS構築・UI改善｜ともきゃん';
const description = 'コーポレートサイト、ブランドサイト、オウンドメディアの制作実績を紹介します。WordPress・CMS構築、フロントエンド、SEO、UI改善の担当範囲や、実装時に判断・工夫したポイントを確認できます。';

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

  const resultsData = await getResults({ limit: RESULTS_LIST_LIMIT, offset: 0, sort: 'new' });
  return <ResultArchive currentPage={1} resultsData={resultsData} />;
}
