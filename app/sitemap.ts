import { MetadataRoute } from 'next';
import { getAllCategoryList, getAllBlogList } from './_libs/microcms';

const buildUrl = (path?: string) => `https://www.tomocan.site/${path ?? '/'}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogContents = await getAllBlogList();
  const categoryContents = await getAllCategoryList();

  const blogUrls: MetadataRoute.Sitemap = blogContents.map((content) => ({
    url: buildUrl(`/diary/${content.id}`),
    lastModified: content.revisedAt,
  }));
  const categoryUrls: MetadataRoute.Sitemap = categoryContents.map((content) => ({
    url: buildUrl(`/diary/category/${content.id}`),
    lastModified: content.revisedAt,
  }));

  const now = new Date();

  return [
    {
      url: buildUrl(),
      lastModified: now,
    },
    {
      url: buildUrl('about'),
      lastModified: now,
    },
    {
      url: buildUrl('contact'),
      lastModified: now,
    },
    {
      url: buildUrl('skill'),
      lastModified: now,
    },
    {
      url: buildUrl('diary'),
      lastModified: now,
    },
    ...blogUrls,
    ...categoryUrls,
  ];
}
