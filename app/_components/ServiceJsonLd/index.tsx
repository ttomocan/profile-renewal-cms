import JsonLd from '../JsonLd';

type Props = {
  name: string;
  description: string;
  serviceType: string[];
  url?: string;
};

export default function ServiceJsonLd({ name, description, serviceType, url }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType,
    provider: {
      '@type': 'Person',
      name: 'ともきゃん',
      url: 'https://www.tomocan.site/about/',
      jobTitle: 'Webエンジニア',
    },
    areaServed: {
      '@type': 'Country',
      name: '日本',
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: url || 'https://www.tomocan.site/contact/',
      serviceType: 'お問い合わせフォーム',
    },
  };

  return <JsonLd jsonLd={jsonLd} />;
}
