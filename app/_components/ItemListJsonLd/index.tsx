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
  pagePath?: string;
  startPosition?: number;
};

export default function ItemListJsonLd({ items, listName = '実績一覧', pagePath = '/result/', startPosition = 1 }: Props) {
  const baseUrl = 'https://www.tomocan.site';
  const pageUrl = `${baseUrl}${pagePath}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${pageUrl}#itemlist`,
    name: listName,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: startPosition + index,
      item: {
        '@type': 'CreativeWork',
        '@id': `${baseUrl}/result/${item.id}/#work`,
        url: `${baseUrl}/result/${item.id}/`,
        name: item.title,
        description: item.summary,
        image: item.cover?.url,
        creator: {
          '@id': `${baseUrl}/about/#person`,
        },
      },
    })),
  };

  return <JsonLd jsonLd={jsonLd} />;
}


