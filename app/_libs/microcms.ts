import { createClient } from 'microcms-js-sdk';
import type { MicroCMSQueries, MicroCMSImage, MicroCMSListContent } from 'microcms-js-sdk';
import type { ResultItem, WorkType, ProjectType, Role, ResultsResponse } from '@/types/results';
import { buildMicroCMSFilters } from '@/lib/parse';
import { compareContentNewest, NEWEST_CONTENT_ORDER } from '@/lib/contentOrder';

// キャッシュ時間の定数（秒単位）
const BLOG_LIST_CACHE_TIME = 60; // ブログ一覧: 60秒
const BLOG_DETAIL_CACHE_TIME = 300; // ブログ詳細: 300秒（5分）
const RESULTS_LIST_CACHE_TIME = 60; // 実績一覧: 60秒
const RESULTS_DETAIL_CACHE_TIME = 300; // 実績詳細: 300秒（5分）

export type Category = {
  name: string;
} & MicroCMSListContent;

export type Blog = {
  title: string;
  description: string;
  content: string;
  thumbnail?: MicroCMSImage;
  thumbnailAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  category: Category;
} & MicroCMSListContent;

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is required');
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is required');
}

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

const BLOG_LIST_FIELDS = 'id,createdAt,publishedAt,updatedAt,revisedAt,title,description,thumbnail,thumbnailAlt,category';
export const RESULT_LIST_FIELDS = 'id,createdAt,publishedAt,updatedAt,revisedAt,title,workType,project-type,project-roles,cover,clientName,summary,period,techStack,highlights,testimonial,kpi,siteUrl,scale';

async function getOrderedList<T extends { id: string; publishedAt?: string; createdAt?: string }>(
  endpoint: string,
  queries: MicroCMSQueries,
  revalidate: number,
  compare: (a: T, b: T) => number = compareContentNewest,
) {
  const { limit = 10, offset = 0, fields, ...filters } = queries;
  const orderFields = typeof fields === 'string' ? fields.split(',') : fields ?? [];
  const fetchQueries = {
    ...filters,
    fields: [...new Set([...orderFields, 'id', 'publishedAt', 'createdAt'])].join(','),
    orders: filters.orders ?? NEWEST_CONTENT_ORDER,
    limit: 100,
  };
  const first = await client.getList<T>({ endpoint, queries: { ...fetchQueries, offset: 0 }, customRequestInit: { next: { revalidate } } });
  const contents = [...first.contents];
  // CMSのordersはID指定に非対応。全候補を取得し、同日時・欠損日も含めてページ分割前に確定する。
  for (let nextOffset = contents.length; nextOffset < first.totalCount;) {
    const page = await client.getList<T>({ endpoint, queries: { ...fetchQueries, offset: nextOffset }, customRequestInit: { next: { revalidate } } });
    if (page.contents.length === 0) throw new Error('コンテンツ一覧の取得が途中で終了しました');
    contents.push(...page.contents);
    nextOffset += page.contents.length;
  }
  const ordered = contents.sort(compare);
  return { contents: ordered.slice(offset, offset + limit), totalCount: first.totalCount, offset, limit };
}

export const getBlogList = async (queries?: MicroCMSQueries) => getOrderedList<Blog>(
  'blog', { ...queries, fields: queries?.fields ?? BLOG_LIST_FIELDS }, BLOG_LIST_CACHE_TIME,
);

export const getBlogDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  const detailData = await client.getListDetail<Blog>({
    endpoint: 'blog',
    contentId,
    queries,
    customRequestInit: {
      next: {
        revalidate: queries?.draftKey === undefined ? BLOG_DETAIL_CACHE_TIME : 0,
      },
    },
  });

  return detailData;
};

export const getCategoryDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  const detailData = await client.getListDetail<Category>({
    endpoint: 'categories',
    contentId,
    queries,
  });

  return detailData;
};

export const getAllBlogList = async () => {
  const listData = await client.getAllContents<Blog>({
    endpoint: 'blog',
    queries: { orders: NEWEST_CONTENT_ORDER },
    customRequestInit: {
      next: {
        revalidate: BLOG_LIST_CACHE_TIME,
      },
    },
  });

  return listData.sort(compareContentNewest);
};

export const getAllCategoryList = async () => {
  const listData = await client.getAllContents<Category>({
    endpoint: 'categories',
    customRequestInit: {
      next: {
        revalidate: BLOG_LIST_CACHE_TIME,
      },
    },
  });

  return listData;
};

export const getAllResultList = async (queries?: Pick<MicroCMSQueries, 'fields'>) => {
  const contents = await client.getAllContents<ResultItem>({
    endpoint: 'result',
    queries: { ...queries, orders: NEWEST_CONTENT_ORDER },
    customRequestInit: {
      next: {
        revalidate: RESULTS_LIST_CACHE_TIME,
      },
    },
  });
  return contents.sort(compareContentNewest);
};

// ===== Results API関数 =====

/**
 * 実績紹介を取得
 */
export const getResults = async (
  params: {
    limit?: number;
    offset?: number;
    workTypeId?: string;
    projectTypeId?: string;
    roleId?: string;
    q?: string;
    sort?: 'new' | 'periodDesc';
  } = {}
): Promise<ResultsResponse> => {
  try {
    const { limit = 12, offset = 0, workTypeId, projectTypeId, roleId, q, sort = 'new' } = params;

    // フィルタ条件を構築
    const filters = buildMicroCMSFilters({
      workTypeId,
      projectTypeId,
      roleId,
      q,
    });

    // ソート条件を設定
    let orders = NEWEST_CONTENT_ORDER;
    if (sort === 'periodDesc') {
      orders = `-period,${NEWEST_CONTENT_ORDER}`;
    }

    // クエリパラメータを構築
    const queries: MicroCMSQueries = {
      limit,
      offset,
      orders,
      fields: RESULT_LIST_FIELDS,
    };

    if (filters.length > 0) {
      queries.filters = filters.join('[and]');
    }

    const response = await getOrderedList<ResultItem>('result', queries, RESULTS_LIST_CACHE_TIME, (a, b) => {
      if (sort === 'periodDesc') {
        const aPeriod = a.period ?? Number.NEGATIVE_INFINITY;
        const bPeriod = b.period ?? Number.NEGATIVE_INFINITY;
        if (aPeriod !== bPeriod) return aPeriod > bPeriod ? -1 : 1;
      }
      return compareContentNewest(a, b);
    });

    return {
      contents: response.contents,
      totalCount: response.totalCount,
      offset: response.offset,
      limit: response.limit,
    };
  } catch (error) {
    console.error('Error fetching results:', error);
    return {
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 12,
    };
  }
};

/**
 * 実績詳細を取得
 */
export const getResultDetail = async (id: string): Promise<ResultItem | null> => {
  try {
    const response = await client.getListDetail<ResultItem>({
      endpoint: 'result',
      contentId: id,
      customRequestInit: {
        next: {
          revalidate: RESULTS_DETAIL_CACHE_TIME,
        },
      },
    });

    return response;
  } catch (error) {
    console.error('Error fetching result detail:', error);
    return null;
  }
};

/**
 * 実績の総数を取得（フィルタ条件付き）
 */
export const getTotalCount = async (
  params: {
    workTypeId?: string;
    projectTypeId?: string;
    roleId?: string;
    q?: string;
  } = {}
): Promise<number> => {
  try {
    const { workTypeId, projectTypeId, roleId, q } = params;

    const filters = buildMicroCMSFilters({
      workTypeId,
      projectTypeId,
      roleId,
      q,
    });

    const queries: MicroCMSQueries = {
      limit: 1,
      fields: 'id',
    };

    if (filters.length > 0) {
      queries.filters = filters.join('[and]');
    }

    const response = await client.getList<ResultItem>({
      endpoint: 'result',
      queries,
      customRequestInit: {
        next: {
          revalidate: RESULTS_LIST_CACHE_TIME,
        },
      },
    });

    return response.totalCount;
  } catch (error) {
    console.error('Error fetching total count:', error);
    return 0;
  }
};

/**
 * プロジェクトタイプの選択肢（セレクトフィールドの値）
 */
export const getResultProjectTypes = (): string[] => {
  // セレクトフィールドで設定した値をここに定義
  return ['コーポレートサイト', 'ブログ', 'ECサイト', 'ランディングページ', 'Webアプリ', 'その他'];
};

/**
 * 担当範囲の選択肢（セレクトフィールドの値）
 */
export const getResultRoles = (): string[] => {
  // セレクトフィールドで設定した値をここに定義
  return ['UI/UXデザイン', 'フロントエンド開発', 'バックエンド開発', 'WordPress構築', 'SEO対策', 'コンサルティング'];
};

/**
 * 案件区分の選択肢（セレクトフィールドの値）
 */
export const getResultWorkTypes = (): string[] => {
  // セレクトフィールドで設定した値をここに定義
  return ['メイン業務', 'フリーランス', '副業', 'その他'];
};
