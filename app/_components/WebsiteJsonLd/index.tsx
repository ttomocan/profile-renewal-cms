import JsonLd from '../JsonLd';

export default function WebsiteJsonLd({ url = 'https://www.tomocan.site', title = 'ともきゃんスタイル - プロフィールサイト', description = 'Webエンジニア兼ブロガーとして活動するともきゃんのプロフィールサイト。自己紹介やWeb制作やブログ運営、SEO対策のスキルを紹介しています。ブログ運営やWeb制作のお悩みがあれば、ぜひご相談ください！', imageUrl = 'https://www.tomocan.site/img/common/ogp.png' }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url,
    name: title,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.tomocan.site/diary/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    author: {
      '@type': 'Person',
      name: 'ともきゃん',
      url: 'https://www.tomocan.site/about/',
    },
    publisher: {
      '@type': 'Person',
      name: 'ともきゃん',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.tomocan.site/img/common/h_logo.png',
      },
    },
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
    },
  };

  return <JsonLd jsonLd={jsonLd} />;
}
