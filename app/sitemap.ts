import type { MetadataRoute } from 'next';
import { DIARY_LIST_LIMIT, RESULTS_LIST_LIMIT } from './_constants';
import { getAllBlogList, getAllCategoryList, getAllResultList } from './_libs/microcms';
import { createCanonicalUrl } from '@/lib/seo';

const STATIC_PATHS = ['/', '/about/', '/contact/', '/skill/', '/diary/', '/result/'];

function latestDate(values: Array<string | undefined>): string | undefined {
  const timestamps = values
    .filter((value): value is string => Boolean(value))
    .map((value) => Date.parse(value))
    .filter(Number.isFinite);
  if (timestamps.length === 0) return undefined;
  return new Date(Math.max(...timestamps)).toISOString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // CMS取得に失敗した場合は例外を伝播し、動的URLが消えた空の成功レスポンスを返さない。
  const [blogContents, categoryContents, resultContents] = await Promise.all([getAllBlogList(), getAllCategoryList(), getAllResultList()]);

  const staticUrls: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: createCanonicalUrl(path),
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.8,
  }));

  const sortedBlogs = [...blogContents].sort((a, b) => Date.parse(b.publishedAt || b.createdAt) - Date.parse(a.publishedAt || a.createdAt));
  const blogUrls: MetadataRoute.Sitemap = sortedBlogs.map((blog) => ({
    url: createCanonicalUrl(`/diary/${blog.id}/`),
    lastModified: blog.revisedAt || blog.updatedAt || blog.publishedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const diaryPaginationUrls: MetadataRoute.Sitemap = Array.from({ length: Math.max(0, Math.ceil(sortedBlogs.length / DIARY_LIST_LIMIT) - 1) }, (_, index) => {
    const page = index + 2;
    const pageItems = sortedBlogs.slice((page - 1) * DIARY_LIST_LIMIT, page * DIARY_LIST_LIMIT);
    return {
      url: createCanonicalUrl(`/diary/p/${page}/`),
      lastModified: latestDate(pageItems.map((item) => item.revisedAt || item.updatedAt || item.publishedAt)),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    };
  });

  const categoryUrls: MetadataRoute.Sitemap = [];
  for (const category of categoryContents) {
    const categoryBlogs = sortedBlogs.filter((blog) => blog.category?.id === category.id);
    if (categoryBlogs.length < 3) continue;

    categoryUrls.push({
      url: createCanonicalUrl(`/diary/category/${category.id}/`),
      lastModified: latestDate(categoryBlogs.map((item) => item.revisedAt || item.updatedAt || item.publishedAt)),
      changeFrequency: 'weekly',
      priority: 0.6,
    });

    for (let page = 2; page <= Math.ceil(categoryBlogs.length / DIARY_LIST_LIMIT); page += 1) {
      const pageItems = categoryBlogs.slice((page - 1) * DIARY_LIST_LIMIT, page * DIARY_LIST_LIMIT);
      categoryUrls.push({
        url: createCanonicalUrl(`/diary/category/${category.id}/p/${page}/`),
        lastModified: latestDate(pageItems.map((item) => item.revisedAt || item.updatedAt || item.publishedAt)),
        changeFrequency: 'weekly',
        priority: 0.5,
      });
    }
  }

  const sortedResults = [...resultContents].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
  const resultUrls: MetadataRoute.Sitemap = sortedResults.map((result) => ({
    url: createCanonicalUrl(`/result/${result.id}/`),
    lastModified: result.revisedAt || result.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const resultPaginationUrls: MetadataRoute.Sitemap = Array.from({ length: Math.max(0, Math.ceil(sortedResults.length / RESULTS_LIST_LIMIT) - 1) }, (_, index) => {
    const page = index + 2;
    const pageItems = sortedResults.slice((page - 1) * RESULTS_LIST_LIMIT, page * RESULTS_LIST_LIMIT);
    return {
      url: createCanonicalUrl(`/result/p/${page}/`),
      lastModified: latestDate(pageItems.map((item) => item.revisedAt || item.updatedAt)),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  });

  return [...staticUrls, ...blogUrls, ...diaryPaginationUrls, ...categoryUrls, ...resultUrls, ...resultPaginationUrls];
}
