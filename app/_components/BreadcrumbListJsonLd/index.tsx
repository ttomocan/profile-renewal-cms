import JsonLd from '../JsonLd';

export type BreadcrumbItem = {
  label: string;
  href?: string;
  active?: boolean;
};

type Props = {
  items: BreadcrumbItem[];
};

export default function BreadcrumbListJsonLd({ items }: Props) {
  const baseUrl = 'https://www.tomocan.site';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `${baseUrl}${item.href}` : undefined,
    })),
  };

  return <JsonLd jsonLd={jsonLd} />;
}

