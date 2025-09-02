import type { WorkType, Scale } from '@/types/results';

/**
 * カンマ区切りの技術スタック文字列を配列に変換
 */
export function parseTechStack(str?: string): string[] {
  try {
    if (!str || typeof str !== 'string') {
      return [];
    }

    return str
      .split(',')
      .map((tech) => tech.trim())
      .filter((tech) => tech.length > 0 && tech !== '未分類');
  } catch (error) {
    console.warn('技術スタックのパース処理でエラーが発生しました:', error);
    return [];
  }
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
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
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
  } else if (/^\d+$/.test(period)) {
    // 数値のみの場合は制作期間（月数）として扱う
    return `約${period}ヶ月`;
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
export function updateSearchParams(currentParams: URLSearchParams, updates: Record<string, string | null>): URLSearchParams {
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
export function buildMicroCMSFilters(params: { workTypeId?: string; projectTypeId?: string; roleId?: string; q?: string }): string[] {
  const filters: string[] = [];

  if (params.workTypeId) {
    filters.push(`workType[equals]${params.workTypeId}`);
  }

  if (params.projectTypeId) {
    filters.push(`project-type[equals]${params.projectTypeId}`);
  }

  if (params.roleId) {
    filters.push(`project-roles[equals]${params.roleId}`);
  }

  if (params.q) {
    // 複数フィールドでのOR検索は制限があるため、タイトルと概要のみに限定
    const searchFields = [`title[contains]${params.q}`, `summary[contains]${params.q}`, `techStack[contains]${params.q}`, `highlights[contains]${params.q}`];
    // OR条件は microCMS の制限により実装が複雑になるため、
    // 簡単のためタイトル検索のみに限定
    filters.push(`title[contains]${params.q}`);
  }

  return filters;
}

/**
 * プロジェクトタイプの安全な取得（未登録対応）
 * 複数選択の場合は「 / 」で区切って返す
 */
export function safeGetProjectType(result: { 'project-type'?: string | string[] }): string {
  const projectType = result['project-type'];
  if (!projectType) return '未分類';

  if (Array.isArray(projectType)) {
    return projectType.join(' / ');
  }

  return projectType;
}

/**
 * 案件区分の安全な取得（未登録対応）
 * 複数選択の場合は「 / 」で区切って返す
 */
export function safeGetWorkType(result: { workType?: WorkType }): string {
  const workType = result.workType;
  if (!workType) return '未分類';

  if (Array.isArray(workType)) {
    return workType.join(' / ');
  }

  return workType;
}

/**
 * 担当範囲の安全な取得（未登録対応）
 * 複数選択の場合は「 / 」で区切って返す
 */
export function safeGetRoles(result: { 'project-roles'?: string | string[] }): string {
  const roles = result['project-roles'];
  if (!roles) return '未分類';

  if (Array.isArray(roles)) {
    return roles.join(' / ');
  }

  return roles;
}

/**
 * 担当範囲を配列で取得（タグ表示用）
 */
export function parseRoles(result: { 'project-roles'?: string | string[] }): string[] {
  try {
    const roles = result['project-roles'];
    if (!roles) return [];

    if (Array.isArray(roles)) {
      return roles.filter(role => role && typeof role === 'string' && role.trim().length > 0 && role !== '未分類');
    }

    if (typeof roles === 'string') {
      // 文字列の場合は / で分割
      return roles
        .split('/')
        .map(role => role.trim())
        .filter(role => role.length > 0 && role !== '未分類');
    }

    return [];
  } catch (error) {
    console.warn('担当範囲のパース処理でエラーが発生しました:', error);
    return [];
  }
}

/**
 * クライアント名の安全な取得（未入力対応）
 */
export function safeGetClientName(clientName?: string): string {
  return clientName || '非公開';
}

/**
 * カバー画像の安全な取得（未設定対応）
 * @param result - 実績データ
 * @param useOgpForDefault - 未設定時にOGP画像を使用するかどうか（一覧ページ用）
 */
export function safeGetCover(result: { cover?: { url: string; width: number; height: number } }, useOgpForDefault: boolean = false): { url: string; width: number; height: number } {
  return (
    result.cover || {
      url: useOgpForDefault ? '/img/common/ogp.png' : '/img/common/default-cover.svg',
      width: 800,
      height: 400,
    }
  );
}

/**
 * プロジェクト規模の安全な取得（未登録対応）
 * 複数選択の場合は「 / 」で区切って返す
 */
export function safeGetScale(result: { scale?: string | string[] }): string {
  const scale = result.scale;
  if (!scale) return '未分類';

  if (Array.isArray(scale)) {
    return scale.join(' / ');
  }

  return scale;
}
