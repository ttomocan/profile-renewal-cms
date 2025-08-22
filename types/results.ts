// 基本型定義
export interface ProjectType {
  id: string;
  name: string;
}

export interface Role {
  id: string;
  name: string;
}

// 案件区分の型定義（microCMSから取得）
export interface WorkType {
  id: string;
  name: string;
}

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
  workType?: WorkType; // 案件区分
  'result-project-type'?: ProjectType; // 案件種別
  cover?: MicroCMSImage; // オプショナルにして未設定に対応
  clientName?: string; // オプショナルにして未入力に対応
  summary: string;
  period?: number; // オプショナルにして未入力に対応
  'result-role'?: Role[]; // 担当範囲
  techStack?: string; // オプショナルにして未入力に対応
  highlights?: string; // オプショナルにして未入力に対応
  testimonial?: string;
  kpi?: string;
  siteUrl?: string;
}

// 検索・フィルタ用の型
export interface ResultsSearchParams {
  workType?: string;
  'result-project-type'?: string;
  'result-role'?: string;
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

// フィルタオプション型
export interface FilterOptions {
  workTypes: WorkType[];
  projectTypes: ProjectType[];
  roles: Role[];
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
