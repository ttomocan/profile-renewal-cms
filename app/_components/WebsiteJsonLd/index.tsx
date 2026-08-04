import JsonLd from '../JsonLd';
import { ORGANIZATION_ID, PERSON_ID, SITE_NAME, SITE_URL, WEBSITE_ID } from '@/lib/seo';

export default function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        inLanguage: 'ja-JP',
        publisher: {
          '@id': ORGANIZATION_ID,
        },
      },
      {
        '@type': 'Organization',
        '@id': ORGANIZATION_ID,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        founder: {
          '@id': PERSON_ID,
        },
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/img/common/h_logo.png`,
        },
      },
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: 'ともきゃん',
        alternateName: 'tomocan',
        url: `${SITE_URL}/about/`,
        image: `${SITE_URL}/img/pages/about/img_tomocan.jpg`,
        jobTitle: 'Webエンジニア',
        sameAs: ['https://x.com/t_tomocan', 'https://coconala.com/users/1531202', 'https://www.newagevoice.com/', 'https://www.blogdesign-mania.com/'],
      },
    ],
  };

  return <JsonLd jsonLd={jsonLd} />;
}
