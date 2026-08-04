import type { ResultItem } from '@/types/results';
import { formatPeriod, parseRoles, parseTechStack, safeGetProjectType, safeGetWorkType } from '@/lib/parse';
import { getResultSeoDescription } from '@/lib/contentSeo';
import { PERSON_ID, SITE_URL, WEBSITE_ID } from '@/lib/seo';
import JsonLd from '../JsonLd';

type Props = {
  result: ResultItem;
};

export default function ResultJsonLd({ result }: Props) {
  const url = `${SITE_URL}/result/${result.id}/`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${url}#work`,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    creator: {
      '@id': PERSON_ID,
    },
    isPartOf: {
      '@id': WEBSITE_ID,
    },
    name: result.title,
    description: getResultSeoDescription(result),
    image: result.cover?.url ?? `${SITE_URL}/img/common/ogp.png`,
    datePublished: result.publishedAt,
    dateModified: result.revisedAt || result.updatedAt,
    inLanguage: 'ja-JP',
    genre: safeGetProjectType(result),
    keywords: parseTechStack(result.techStack),
    temporalCoverage: formatPeriod(result.period),
    about: [safeGetWorkType(result), ...parseRoles(result)].filter((value) => value !== '未分類'),
  };

  return <JsonLd jsonLd={jsonLd} />;
}
