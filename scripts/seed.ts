/**
 * microCMS実績データのモック
 * 実際の運用では microCMS 管理画面から登録します
 */

import type { ResultItem } from '@/types/results';

export const mockResults: ResultItem[] = [
  {
    id: 'result-001',
    publishedAt: '2024-01-15T09:00:00.000Z',
    updatedAt: '2024-01-15T09:00:00.000Z',
    title: 'コーポレートサイト リニューアル',
    workType: 'メイン業務',
    'project-type': 'コーポレートサイト',
    cover: {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
      width: 800,
      height: 400
    },
    clientName: '株式会社サンプル企業',
    summary: '既存のコーポレートサイトを全面リニューアル。モダンなデザインと使いやすいUI/UXを実現し、問い合わせ数が30%向上しました。レスポンシブ対応により、モバイルユーザーの離脱率も大幅に改善されました。',
    period: 202401,
    'project-roles': ['UI/UXデザイン', 'フロントエンド開発'],
    techStack: 'HTML, CSS, JavaScript, PHP, WordPress, Figma, Photoshop',
    highlights: 'ユーザビリティを重視したナビゲーション設計\nページ読み込み速度の最適化（Core Web Vitals対応）\nSEOに配慮した構造化マークアップ\nアクセシビリティガイドラインに準拠',
    testimonial: 'デザインがとても洗練されて、お客様からの反応も良くなりました。サイトの使いやすさが向上したおかげで、問い合わせも増えています。',
    kpi: '問い合わせ数: 30%向上\nページ滞在時間: 45%向上\nモバイル離脱率: 25%改善\nCore Web Vitals: 全指標で改善',
    siteUrl: 'https://example-corporate.com'
  },
  {
    id: 'result-002',
    publishedAt: '2024-02-20T09:00:00.000Z',
    updatedAt: '2024-02-20T09:00:00.000Z',
    title: '個人ブログ デザインカスタマイズ',
    workType: 'フリーランス',
    'project-type': 'ブログ',
    // cover未設定でテスト
    // clientName未設定でテスト
    summary: '個人で運営されているライフスタイルブログのデザインを全面的にカスタマイズ。読みやすさを重視したタイポグラフィとカラースキームを採用し、読者の滞在時間向上を実現しました。',
    period: 202402,
    'project-roles': ['フロントエンド開発', 'WordPress構築'],
    techStack: 'HTML, CSS, JavaScript, WordPress, Figma, XD',
    highlights: '読みやすさを重視したタイポグラフィ設計\nブランドカラーに合わせたカラーパレット\nSNSシェア機能の最適化\nカテゴリー表示の改善',
    // testimonial未設定でテスト
    kpi: 'ページ滞在時間: 35%向上\n直帰率: 20%改善\nSNSシェア数: 50%向上'
    // siteUrl未設定でテスト
  },
  {
    id: 'result-003',
    publishedAt: '2024-03-10T09:00:00.000Z',
    updatedAt: '2024-03-10T09:00:00.000Z',
    title: 'ECサイト UI/UX改善',
    workType: ['副業', 'フリーランス'],
    'project-type': ['ECサイト', 'Webアプリ'],
    cover: {
      url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
      width: 800,
      height: 400
    },
    clientName: '株式会社オンラインショップ',
    summary: '既存ECサイトのユーザビリティを向上させるためのUI/UX改善プロジェクト。商品検索機能の強化、カート機能の最適化、チェックアウトプロセスの簡素化を実施し、コンバージョン率を大幅に改善しました。',
    period: 202403,
    'project-roles': ['UI/UXデザイン', 'SEO対策', 'コンサルティング'],
    techStack: 'HTML, CSS, JavaScript, React, TypeScript, Figma, Adobe XD',
    highlights: 'ユーザーテストに基づく改善案の立案\n商品検索機能のUX改善\nカートページの操作性向上\nチェックアウトプロセスの簡素化\nA/Bテストによる効果検証',
    testimonial: 'サイトの使いやすさが格段に向上し、お客様からのクレームが減りました。売上も順調に伸びており、大変満足しています。',
    kpi: 'コンバージョン率: 40%向上\nカート離脱率: 30%改善\n売上: 25%向上\nユーザビリティスコア: 20%向上',
    siteUrl: 'https://example-ec.com'
  }
];

export const mockWorkTypes = [
  'メイン業務',
  'フリーランス',
  '副業'
];

export const mockProjectTypes = [
  'コーポレートサイト',
  'ブログ',
  'ECサイト',
  'ランディングページ',
  'Webアプリ'
];

export const mockRoles = [
  'UI/UXデザイン',
  'フロントエンド開発',
  'バックエンド開発',
  'WordPress構築',
  'SEO対策',
  'コンサルティング'
];
