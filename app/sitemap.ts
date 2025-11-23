import { MetadataRoute } from 'next';
import { getAllCategoryList, getAllBlogList, getResults } from './_libs/microcms';

const BASE_URL = 'https://www.tomocan.site';

const buildUrl = (path: string = '/') => {
  if (path === '/' || path === '') return `${BASE_URL}`;
  return `${BASE_URL}/${path.replace(/^\/+/, '').replace(/\/+$/, '')}`;
};

const STATIC_PATHS = ['', 'about', 'contact', 'skill', 'diary', 'result'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // 実績を全件取得するための関数
    const getAllResults = async () => {
      let allResults: any[] = [];
      let offset = 0;
      const limit = 100;

      while (true) {
        const data = await getResults({ limit, offset });
        allResults = [...allResults, ...data.contents];

        if (data.contents.length < limit) {
          break; // 最後のページに到達
        }
        offset += limit;
      }

      return { contents: allResults };
    };

    const [blogContents, categoryContents, resultsData] = await Promise.all([getAllBlogList(), getAllCategoryList(), getAllResults()]);

    const now = new Date();

    const staticUrls: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
      url: buildUrl(path),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1.0 : 0.8,
    }));

    const blogUrls: MetadataRoute.Sitemap = blogContents.map(({ id, revisedAt }) => ({
      url: buildUrl(`diary/${id}`),
      lastModified: revisedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    const categoryUrls: MetadataRoute.Sitemap = categoryContents.map(({ id, revisedAt }) => ({
      url: buildUrl(`diary/category/${id}`),
      lastModified: revisedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    const resultUrls: MetadataRoute.Sitemap = resultsData.contents.map(({ id, updatedAt }) => ({
      url: buildUrl(`result/${id}`),
      lastModified: updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    return [...staticUrls, ...blogUrls, ...categoryUrls, ...resultUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // エラーが発生した場合は最低限の静的ページのみを返す
    const now = new Date();
    return STATIC_PATHS.map((path) => ({
      url: buildUrl(path),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1.0 : 0.8,
    }));
  }
}
