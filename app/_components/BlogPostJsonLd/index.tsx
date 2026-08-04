import JsonLd from '../JsonLd';
import type { Blog } from '@/app/_libs/microcms';
import { getBlogSeoDescription } from '@/lib/contentSeo';
import { ORGANIZATION_ID, PERSON_ID, SITE_URL, WEBSITE_ID } from '@/lib/seo';

type Props = {
  blog: Blog;
  url: string;
};

export default function BlogPostJsonLd({ blog, url }: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    isPartOf: {
      '@id': WEBSITE_ID,
    },
    headline: blog.title,
    description: getBlogSeoDescription(blog),
    image: blog.thumbnail?.url || `${SITE_URL}/img/common/ogp.png`,
    datePublished: blog.publishedAt,
    dateModified: blog.revisedAt || blog.updatedAt || blog.publishedAt,
    inLanguage: 'ja-JP',
    author: {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'ともきゃん',
      url: `${SITE_URL}/about/`,
    },
    publisher: {
      '@id': ORGANIZATION_ID,
    },
  };

  return <JsonLd jsonLd={jsonLd} />;
}
