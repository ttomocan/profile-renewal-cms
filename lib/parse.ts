import type { WorkType } from '@/types/results';

/**
 * カンマ区切りの技術スタック文字列を配列に変換
 */
export function parseTechStack(str?: string): string[] {
  if (!str || typeof str !== 'string') {
    return [];
  }

  return str
    .split(',')
    .map(tech => tech.trim())
    .filter(tech => tech.length > 0);
}

/**
 * 改行区切りのハイライト文字列を配列に変換
 */
export function splitHighlights(str?: string): string[] {
  if (!str || typeof str !== 'string') {
    return [];
  }

  return str
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

/**
 * 期間の数値を読みやすい形式に変換
 * @param period - YYYY, YYYYMM, または範囲指定の数値
 * @returns フォーマット済み文字列
 */
export function formatPeriod(period?: number | string): string {
  if (!period) {
    return '期間不明';
  }

  const periodStr = String(period);

  // ハイフンが含まれる場合は範囲指定
  if (periodStr.includes('-')) {
    const [start, end] = periodStr.split('-');
    return `${formatSinglePeriod(start)}〜${formatSinglePeriod(end)}`;
  }

  return formatSinglePeriod(periodStr);
}

/**
 * 単一期間の数値を読みやすい形式に変換
 */
function formatSinglePeriod(period: string): string {
  if (period.length === 4) {
    // YYYY形式
    return `${period}年`;
  } else if (period.length === 6) {
    // YYYYMM形式
    const year = period.substring(0, 4);
    const month = period.substring(4, 6);
    return `${year}年${parseInt(month, 10)}月`;
  }

  return period;
}

/**
 * 検索クエリパラメータを正規化
 */
export function normalizeSearchParams(params: URLSearchParams) {
  const normalized: Record<string, string> = {};

  for (const [key, value] of params.entries()) {
    if (value && value.trim()) {
      normalized[key] = value.trim();
    }
  }

  return normalized;
}

/**
 * ページ番号を正規化（1以上の整数にする）
 */
export function normalizePage(page: string | null): number {
  if (!page) return 1;

  const pageNum = parseInt(page, 10);
  return pageNum > 0 ? pageNum : 1;
}

/**
 * URLSearchParamsを安全に更新
 */
export function updateSearchParams(
  currentParams: URLSearchParams,
  updates: Record<string, string | null>
): URLSearchParams {
  const newParams = new URLSearchParams(currentParams);

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
  });

  return newParams;
}

/**
 * microCMS の検索フィルタを構築
 */
export function buildMicroCMSFilters(params: {
  workTypeId?: string;
  projectTypeId?: string;
  roleId?: string;
  q?: string;
}): string[] {
  const filters: string[] = [];

  if (params.workTypeId) {
    filters.push(`workType[equals]${params.workTypeId}`);
  }

  if (params.projectTypeId) {
    filters.push(`result-project-type[equals]${params.projectTypeId}`);
  }

  if (params.roleId) {
    filters.push(`result-role[contains]${params.roleId}`);
  }

  if (params.q) {
    // 複数フィールドでのOR検索は制限があるため、タイトルと概要のみに限定
    const searchFields = [
      `title[contains]${params.q}`,
      `summary[contains]${params.q}`,
      `techStack[contains]${params.q}`,
      `highlights[contains]${params.q}`
    ];
    // OR条件は microCMS の制限により実装が複雑になるため、
    // 簡単のためタイトル検索のみに限定
    filters.push(`title[contains]${params.q}`);
  }

  return filters;
}

/**
 * プロジェクトタイプの安全な取得（未登録対応）
 */
export function safeGetProjectType(result: { 'result-project-type'?: { id: string; name: string } }): { id: string; name: string } {
  return result['result-project-type'] || { id: 'unknown', name: '未分類' };
}

/**
 * 案件区分の安全な取得（未登録対応）
 */
export function safeGetWorkType(result: { workType?: WorkType }): { id: string; name: string } {
  return result.workType || { id: 'unknown', name: '未分類' };
}

/**
 * 役割配列の安全な取得（未登録対応）
 */
export function safeGetRoles(result: { 'result-role'?: { id: string; name: string }[] }): { id: string; name: string }[] {
  return result['result-role'] || [];
}

/**
 * クライアント名の安全な取得（未入力対応）
 */
export function safeGetClientName(clientName?: string): string {
  return clientName || '非公開';
}

/**
 * カバー画像の安全な取得（未設定対応）
 */
export function safeGetCover(result: { cover?: { url: string; width: number; height: number } }): { url: string; width: number; height: number } {
  return result.cover || {
    url: '/img/common/default-cover.svg',
    width: 800,
    height: 400
  };
}
