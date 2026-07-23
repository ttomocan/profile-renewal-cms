import type { ResultItem } from '@/types/results';
import { formatPeriod, parseRoles, parseTechStack, safeGetProjectType, safeGetWorkType } from '@/lib/parse';
import JsonLd from '../JsonLd';

type Props = {
  result: ResultItem;
};

export default function ResultJsonLd({ result }: Props) {
  const url = `https://www.tomocan.site/result/${result.id}/`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': url,
    url,
    name: result.title,
    description: result.summary,
    image: result.cover?.url ?? 'https://www.tomocan.site/img/common/ogp.png',
    datePublished: result.publishedAt,
    dateModified: result.updatedAt,
    genre: safeGetProjectType(result),
    keywords: parseTechStack(result.techStack),
    temporalCoverage: formatPeriod(result.period),
    about: [safeGetWorkType(result), ...parseRoles(result)],
    author: {
      '@type': 'Person',
      '@id': 'https://www.tomocan.site/about/#person',
      name: 'ともきゃん',
      url: 'https://www.tomocan.site/about/',
    },
  };

  return <JsonLd jsonLd={jsonLd} />;
}
