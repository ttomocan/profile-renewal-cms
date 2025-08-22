import { createClient } from 'microcms-js-sdk';
import type { MicroCMSQueries, MicroCMSImage, MicroCMSListContent } from 'microcms-js-sdk';
import type { ResultItem, WorkType, ProjectType, Role, ResultsResponse } from '@/types/results';
import { buildMicroCMSFilters } from '@/lib/parse';

export type Category = {
  name: string;
} & MicroCMSListContent;

export type Blog = {
  title: string;
  description: string;
  content: string;
  thumbnail?: MicroCMSImage;
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

export const getBlogList = async (queries?: MicroCMSQueries) => {
  const listData = await client.getList<Blog>({
    endpoint: 'blog',
    queries,
    customRequestInit: {
      next: {
        revalidate: 30,
      },
    },
  });
  return listData;
};

export const getBlogDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  const detailData = await client.getListDetail<Blog>({
    endpoint: 'blog',
    contentId,
    queries,
    customRequestInit: {
      next: {
        revalidate: queries?.draftKey === undefined ? 30 : 0,
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
    customRequestInit: {
      next: {
        revalidate: 30,
      },
    },
  });

  return listData;
};

export const getAllCategoryList = async () => {
  const listData = await client.getAllContents<Category>({
    endpoint: 'categories',
    customRequestInit: {
      next: {
        revalidate: 30,
      },
    },
  });

  return listData;
};

// ===== Results API関数 =====

/**
 * 実績一覧を取得
 */
export const getResults = async (params: {
  limit?: number;
  offset?: number;
  workTypeId?: string;
  projectTypeId?: string;
  roleId?: string;
  q?: string;
  sort?: 'new' | 'periodDesc';
} = {}): Promise<ResultsResponse> => {
  try {
    const {
      limit = 12,
      offset = 0,
      workTypeId,
      projectTypeId,
      roleId,
      q,
      sort = 'new'
    } = params;

    // フィルタ条件を構築
    const filters = buildMicroCMSFilters({
      workTypeId,
      projectTypeId,
      roleId,
      q
    });

    // ソート条件を設定
    let orders = '-publishedAt'; // デフォルトは新着順
    if (sort === 'periodDesc') {
      orders = '-period,-publishedAt'; // 制作期間降順、同じ期間なら公開日降順
    }

    // クエリパラメータを構築
    const queries: MicroCMSQueries = {
      limit,
      offset,
      orders,
      fields: 'id,publishedAt,updatedAt,title,workType,result-project-type,result-role,cover,clientName,summary,period,techStack,highlights,testimonial,kpi,siteUrl'
    };

    if (filters.length > 0) {
      queries.filters = filters.join('[and]');
    }

    const response = await client.getList<ResultItem>({
      endpoint: 'results',
      queries,
      customRequestInit: {
        next: {
          revalidate: 60, // 60秒キャッシュ
        },
      },
    });

    return {
      contents: response.contents,
      totalCount: response.totalCount,
      offset: response.offset,
      limit: response.limit
    };
  } catch (error) {
    console.error('Error fetching results:', error);
    return {
      contents: [],
      totalCount: 0,
      offset: 0,
      limit: 12
    };
  }
};

/**
 * 実績詳細を取得
 */
export const getResultDetail = async (id: string): Promise<ResultItem | null> => {
  try {
    const response = await client.getListDetail<ResultItem>({
      endpoint: 'results',
      contentId: id,
      customRequestInit: {
        next: {
          revalidate: 300, // 5分キャッシュ
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
export const getTotalCount = async (params: {
  workTypeId?: string;
  projectTypeId?: string;
  roleId?: string;
  q?: string;
} = {}): Promise<number> => {
  try {
    const { workTypeId, projectTypeId, roleId, q } = params;

    const filters = buildMicroCMSFilters({
      workTypeId,
      projectTypeId,
      roleId,
      q
    });

    const queries: MicroCMSQueries = {
      limit: 1,
      fields: 'id'
    };

    if (filters.length > 0) {
      queries.filters = filters.join('[and]');
    }

    const response = await client.getList<ResultItem>({
      endpoint: 'results',
      queries,
      customRequestInit: {
        next: {
          revalidate: 60,
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
 * プロジェクトタイプ一覧を取得（results用）
 */
export const getResultProjectTypes = async (): Promise<ProjectType[]> => {
  try {
    const response = await client.getAllContents<ProjectType>({
      endpoint: 'project-types',
      customRequestInit: {
        next: {
          revalidate: 300,
        },
      },
    });

    return response;
  } catch (error) {
    console.error('Error fetching result project types:', error);
    return [];
  }
};

/**
 * 役割一覧を取得（results用）
 */
export const getResultRoles = async (): Promise<Role[]> => {
  try {
    const response = await client.getAllContents<Role>({
      endpoint: 'roles',
      customRequestInit: {
        next: {
          revalidate: 300,
        },
      },
    });

    return response;
  } catch (error) {
    console.error('Error fetching result roles:', error);
    return [];
  }
};

/**
 * 案件区分一覧を取得（results用）
 */
export const getResultWorkTypes = async (): Promise<WorkType[]> => {
  try {
    const response = await client.getAllContents<WorkType>({
      endpoint: 'work-types',
      customRequestInit: {
        next: {
          revalidate: 300,
        },
      },
    });

    return response;
  } catch (error) {
    console.error('Error fetching result work types:', error);
    return [];
  }
};
