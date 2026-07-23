import JsonLd from '../JsonLd';

export default function PersonJsonLd() {
  const person = {
    '@type': 'Person',
    '@id': 'https://www.tomocan.site/about/#person',
    name: 'ともきゃん',
    alternateName: 'tomocan',
    url: 'https://www.tomocan.site/about/',
    image: 'https://www.tomocan.site/img/pages/about/img_tomocan.jpg',
    jobTitle: 'Webエンジニア',
    sameAs: ['https://x.com/t_tomocan', 'https://coconala.com/users/1531202', 'https://www.newagevoice.com/', 'https://www.blogdesign-mania.com/'],
    knowsAbout: ['Web開発', 'フロントエンド開発', 'WordPress', 'Next.js', 'React', 'TypeScript', 'SEO', 'ブログ運営'],
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': 'https://www.tomocan.site/about/#profile-page',
    url: 'https://www.tomocan.site/about/',
    name: 'ともきゃんのプロフィール・経歴',
    mainEntity: person,
  };

  return <JsonLd jsonLd={jsonLd} />;
}
