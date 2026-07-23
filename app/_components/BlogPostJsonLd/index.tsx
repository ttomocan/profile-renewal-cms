import JsonLd from '../JsonLd';
import { Blog } from '@/app/_libs/microcms';

type Props = {
  blog: Blog;
  url: string;
};

export default function BlogPostJsonLd({ blog, url }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: blog.title,
    description: blog.description,
    image: blog.thumbnail?.url || 'https://www.tomocan.site/img/common/ogp.png',
    datePublished: blog.publishedAt,
    dateModified: blog.revisedAt || blog.publishedAt,
    author: {
      '@type': 'Person',
      name: 'ともきゃん',
      url: 'https://www.tomocan.site/about/',
    },
    publisher: {
      '@type': 'Person',
      name: 'ともきゃん',
      url: 'https://www.tomocan.site/about/',
    },
  };

  return <JsonLd jsonLd={jsonLd} />;
}
