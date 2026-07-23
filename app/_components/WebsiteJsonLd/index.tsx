import JsonLd from '../JsonLd';

export default function WebsiteJsonLd({ url = 'https://www.tomocan.site/', title = 'ともきゃんスタイル', description = 'Web制作会社で10年以上、200サイト以上の制作に携わってきたWebエンジニア・ともきゃんのポートフォリオ。WordPress、フロントエンド、CMS構築、UI改善、SEO、個人開発の実績を紹介します。', imageUrl = 'https://www.tomocan.site/img/common/ogp.png' }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url,
    name: title,
    description,
    inLanguage: 'ja-JP',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.tomocan.site/diary/search/?q={search_term_string}',
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
    keywords: ['Webエンジニア', 'Web制作', 'UI改善', 'SEO', 'WordPress', 'Next.js', 'ブログ運営'],
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
    },
  };

  return <JsonLd jsonLd={jsonLd} />;
}
