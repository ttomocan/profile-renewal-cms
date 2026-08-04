import JsonLd from '../JsonLd';
import { PERSON_ID, SITE_URL, WEBSITE_ID } from '@/lib/seo';

export default function PersonJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${SITE_URL}/about/#profile-page`,
    url: `${SITE_URL}/about/`,
    name: 'Webエンジニア ともきゃんのプロフィール・経歴',
    isPartOf: {
      '@id': WEBSITE_ID,
    },
    mainEntity: {
      '@id': PERSON_ID,
    },
  };

  return <JsonLd jsonLd={jsonLd} />;
}
