import JsonLd from '../JsonLd';

type Item = {
  id: string;
  title: string;
  summary?: string;
  cover?: {
    url: string;
  };
};

type Props = {
  items: Item[];
  listName?: string;
};

export default function ItemListJsonLd({ items, listName = '実績一覧' }: Props) {
  const baseUrl = 'https://www.tomocan.site';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        '@id': `${baseUrl}/result/${item.id}/`,
        name: item.title,
        description: item.summary,
        image: item.cover?.url,
        author: {
          '@type': 'Person',
          name: 'ともきゃん',
          url: `${baseUrl}/about/`,
        },
      },
    })),
  };

  return <JsonLd jsonLd={jsonLd} />;
}


