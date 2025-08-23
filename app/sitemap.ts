import { MetadataRoute } from 'next';
import { getAllCategoryList, getAllBlogList, getResults } from './_libs/microcms';

const BASE_URL = 'https://www.tomocan.site';

const buildUrl = (path: string = '/') => {
  if (path === '/' || path === '') return `${BASE_URL}/`;
  return `${BASE_URL}/${path.replace(/^\/+/, '')}/`;
};

const STATIC_PATHS = ['', 'about', 'contact', 'skill', 'diary', 'results'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogContents, categoryContents, resultsData] = await Promise.all([
    getAllBlogList(),
    getAllCategoryList(),
    getResults({ limit: 1000 }), // 全実績を取得
  ]);

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

  const resultUrls: MetadataRoute.Sitemap = resultsData.contents.map(({ id, updatedAt }) => ({
    url: buildUrl(`results/${id}`),
    lastModified: updatedAt,
  }));

  return [...staticUrls, ...blogUrls, ...categoryUrls, ...resultUrls];
}
