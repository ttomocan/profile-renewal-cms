// プロジェクトタイプの型定義（セレクトフィールドの値：単一または複数選択）
export type ProjectType = string | string[];

// 担当範囲の型定義（セレクトフィールドの値：単一または複数選択）
export type Role = string | string[];

// 案件区分の型定義（セレクトフィールドの値：単一または複数選択）
export type WorkType = string | string[];

// microCMS の画像型
export interface MicroCMSImage {
  url: string;
  height: number;
  width: number;
}

// 実績アイテムの型定義
export interface ResultItem {
  id: string;
  publishedAt: string;
  updatedAt: string;
  title: string;
  workType?: WorkType; // 案件区分（セレクトフィールドの文字列値）
  'project-type'?: ProjectType; // 案件種別（セレクトフィールドの文字列値）
  cover?: MicroCMSImage; // オプショナルにして未設定に対応
  clientName?: string; // オプショナルにして未入力に対応
  summary: string;
  period?: number; // オプショナルにして未入力に対応
  'project-roles'?: Role; // 担当範囲（セレクトフィールドの文字列値）
  techStack?: string; // オプショナルにして未入力に対応
  highlights?: string; // オプショナルにして未入力に対応
  testimonial?: string;
  kpi?: string;
  siteUrl?: string;
}

// 検索・フィルタ用の型
export interface ResultsSearchParams {
  workType?: string;
  'project-type'?: string;
  'project-roles'?: string;
  q?: string;
  sort?: 'new' | 'periodDesc';
  page?: string;
}

// API レスポンス型
export interface ResultsResponse {
  contents: ResultItem[];
  totalCount: number;
  offset: number;
  limit: number;
}

// フィルタオプション型（すべて文字列配列）
export interface FilterOptions {
  workTypes: string[];
  projectTypes: string[];
  roles: string[];
}

// ソートオプション型
export interface SortOption {
  value: string;
  label: string;
}

// ソートオプション
export const sortOptions: SortOption[] = [
  { value: 'new', label: '新着順' },
  { value: 'periodDesc', label: '制作期間（降順）' }
];
