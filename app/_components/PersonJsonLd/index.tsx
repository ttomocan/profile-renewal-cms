import JsonLd from '../JsonLd';

export default function PersonJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'ともきゃん',
    alternateName: 'tomocan',
    url: 'https://www.tomocan.site',
    image: 'https://www.tomocan.site/img/pages/about/img_tomocan.jpg',
    jobTitle: 'Webエンジニア',
    worksFor: {
      '@type': 'Organization',
      name: 'ともきゃんスタイル',
      url: 'https://www.tomocan.site',
    },
    sameAs: ['https://x.com/t_tomocan', 'https://coconala.com/users/1531202', 'https://www.newagevoice.com/', 'https://www.blogdesign-mania.com/'],
    knowsAbout: ['Web開発', 'フロントエンド開発', 'WordPress', 'Next.js', 'React', 'TypeScript', 'SEO', 'ブログ運営'],
  };

  return <JsonLd jsonLd={jsonLd} />;
}
