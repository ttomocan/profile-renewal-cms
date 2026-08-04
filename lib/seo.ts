import type { Metadata } from 'next';

export const SITE_URL = 'https://www.tomocan.site';
export const SITE_NAME = 'ともきゃんスタイル';
export const PERSON_ID = `${SITE_URL}/about/#person`;
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const DEFAULT_OG_IMAGE = '/img/common/ogp.png';

type CreateMetadataOptions = {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
};

export function normalizePath(path: string): string {
  if (!path || path === '/') return '/';
  return `/${path.replace(/^\/+|\/+$/g, '')}/`;
}

export function createCanonicalUrl(path: string): string {
  return `${SITE_URL}${normalizePath(path)}`;
}

export function createAbsoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}

export function createMetadata({
  title,
  description,
  path,
  type = 'website',
  image = DEFAULT_OG_IMAGE,
  imageAlt = title,
  noindex = false,
}: CreateMetadataOptions): Metadata {
  const canonical = createCanonicalUrl(path);
  const absoluteImageUrl = createAbsoluteUrl(image);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: noindex
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: {
      title,
      description,
      url: canonical,
      type,
      siteName: SITE_NAME,
      locale: 'ja_JP',
      images: [
        {
          url: absoluteImageUrl,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteImageUrl],
    },
  };
}

export function createMetaDescription(value: string | undefined, maxLength = 150): string {
  const normalized = (value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (normalized.length <= maxLength) return normalized;

  const candidate = normalized.slice(0, maxLength);
  const sentenceEnd = Math.max(candidate.lastIndexOf('。'), candidate.lastIndexOf('！'), candidate.lastIndexOf('？'));

  if (sentenceEnd >= Math.min(30, Math.floor(maxLength * 0.25))) {
    return candidate.slice(0, sentenceEnd + 1);
  }

  return `${candidate.replace(/[、,\s]+$/, '')}…`;
}
