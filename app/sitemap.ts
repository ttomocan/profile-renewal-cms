import { MetadataRoute } from 'next';
import { getAllCategoryList, getAllBlogList } from './_libs/microcms';

const BASE_URL = 'https://www.tomocan.site';

const buildUrl = (path: string = '/') => {
  if (path === '/' || path === '') return `${BASE_URL}/`;
  return `${BASE_URL}/${path.replace(/^\/+/, '')}/`;
};

const STATIC_PATHS = ['', 'about', 'contact', 'skill', 'diary'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogContents, categoryContents] = await Promise.all([getAllBlogList(), getAllCategoryList()]);

  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: buildUrl(path),
    lastModified: now,
  }));

  const blogUrls: MetadataRoute.Sitemap = blogContents.map(({ id, revisedAt }) => ({
    url: buildUrl(`diary/${id}`),
    lastModified: revisedAt,
  }));

  const categoryUrls: MetadataRoute.Sitemap = categoryContents.map(({ id, revisedAt }) => ({
    url: buildUrl(`diary/category/${id}`),
    lastModified: revisedAt,
  }));

  return [...staticUrls, ...blogUrls, ...categoryUrls];
}
