import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { RESULTS_LIST_LIMIT } from '@/app/_constants';
import { getResults } from '@/app/_libs/microcms';
import ResultArchive from '@/app/result/_components/ResultArchive';
import { parseStrictPageNumber } from '@/lib/parse';
import { createMetadata } from '@/lib/seo';
import '@/styles/pages/result.scss';

type Props = {
  params: Promise<{ current: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { current } = await params;
  const currentPage = parseStrictPageNumber(current);

  if (!currentPage || currentPage === 1) {
    return createMetadata({
      title: '制作実績ページが見つかりません',
      description: '指定された制作実績一覧ページは存在しません。',
      path: `/result/p/${current}/`,
      noindex: true,
    });
  }

  return createMetadata({
    title: `Web制作実績 ${currentPage}ページ目｜ともきゃん`,
    description: `WordPress・CMS構築、フロントエンド、SEO、UI改善の制作実績一覧 ${currentPage}ページ目です。各案件の担当範囲、使用技術、実装時に判断・工夫したポイントを紹介します。`,
    path: `/result/p/${currentPage}/`,
  });
}

export default async function PaginatedResultsPage({ params }: Props) {
  const { current } = await params;
  const currentPage = parseStrictPageNumber(current);

  if (!currentPage) notFound();
  if (currentPage === 1) permanentRedirect('/result/');

  const resultsData = await getResults({
    limit: RESULTS_LIST_LIMIT,
    offset: RESULTS_LIST_LIMIT * (currentPage - 1),
    sort: 'new',
  });
  const totalPages = Math.ceil(resultsData.totalCount / RESULTS_LIST_LIMIT);

  if (currentPage > totalPages || resultsData.contents.length === 0) notFound();

  return <ResultArchive currentPage={currentPage} resultsData={resultsData} />;
}
