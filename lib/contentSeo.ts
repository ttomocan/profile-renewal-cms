import { parseTechStack, safeGetProjectType } from '@/lib/parse';
import { createMetaDescription } from '@/lib/seo';
import type { ResultItem } from '@/types/results';

const RESULT_SEO_TITLES: Record<string, string> = {
  'social-entrepreneurship-program-01': '社会起業家育成サイトの制作実績｜CMS構築・フロントエンド',
  'corporate-handball-team-01': 'スポーツチーム公式サイトの制作実績｜試合情報CMS・UI設計',
  'healthcare-brand-01': 'ヘルスケア製品サイトの制作実績｜商品比較UI・CMS構築',
  'career-media-01': '40代向け転職メディアの制作実績｜WordPress・記事UI',
  'risk-management-corporate-01': 'BtoB与信管理企業サイトの制作実績｜多言語・CMS構築',
  'performance-corporate-01': 'コンディショニング企業サイトの制作実績｜WordPress・UI改善',
  'food-corporate-01': '食品メーカー大規模サイトの制作実績｜WordPress・SEO改善',
  'business-blog-01': 'WordPressブログの制作実績｜記事UI・SEO・相談導線を設計',
  'steel-corporate-01': '大手製造業サイトの制作実績｜WordPress・構造化データ・速度改善',
};

// 現在公開されているmicroCMSの規模・担当範囲・使用技術だけを根拠にしたフォールバック。
// microCMSにseoDescriptionが追加された場合は、その入力値が常に優先される。
const RESULT_SEO_DESCRIPTIONS: Record<string, string> = {
  'social-entrepreneurship-program-01': '社会起業家育成プログラム公式サイトの制作実績です。31～50ページ規模で、WordPressのCMS構築、フロントエンド、バックエンド、SEO・パフォーマンス改善、運用・保守を担当しました。',
  'corporate-handball-team-01': '企業スポーツチーム公式サイトの制作実績です。101ページ以上の試合日程・結果やメンバー情報を扱うサイトで、WordPressのCMS構築、フロントエンド、バックエンド、SEO・パフォーマンス改善を担当しました。',
  'healthcare-brand-01': 'ヘルスケア機器ブランドの製品サイト制作実績です。31～50ページ規模で、製品カテゴリやランキングを比較しやすいUIのフロントエンド実装とSEO・パフォーマンス改善を担当しました。',
  'career-media-01': '40代向け転職メディアの制作実績です。31～50ページ規模で、WordPressのCMS構築、記事を読み進めやすいUI設計、フロントエンド、SEO・パフォーマンス改善を担当しました。',
  'risk-management-corporate-01': 'BtoB向け与信管理企業のコーポレートサイト制作実績です。101ページ以上の日本語・英語・簡体字サイトで、WordPressのCMS構築、フロントエンド、バックエンド、SEO・パフォーマンス改善を担当しました。',
  'performance-corporate-01': 'コンディショニング企業のコーポレートサイト制作実績です。11～30ページ規模で、WordPressのCMS構築、デザイン、フロントエンド、SEO・パフォーマンス改善を担当しました。',
  'food-corporate-01': '101ページ以上の食品メーカーサイトをリニューアルした制作実績です。WordPressのCMS構築、フロントエンド、バックエンド、SEO・パフォーマンス改善、運用・保守を担当しました。',
  'business-blog-01': 'Webビジネス情報を発信するWordPressブログの制作実績です。11～30ページ規模で、記事UI、CMS構築、フロントエンド、バックエンド、SEO・パフォーマンス改善を担当しました。',
  'steel-corporate-01': '101ページ以上の大手製造業コーポレートサイト制作実績です。WordPressのCMS構築、フロントエンド、バックエンド、SEO・パフォーマンス改善、運用・保守を担当しました。',
};

const BLOG_SEO_TITLES: Record<string, string> = {
  'work-childcare-balance': '仕事と育児を両立する方法｜2歳児家庭の在宅勤務・家事分担',
  'thankyou-2025': '2025年の振り返り｜育児・転職・Web開発で変化した一年',
  'iropon-release': '色彩検定クイズアプリ「いろポン！」開発記｜Cursor・Claude活用',
  'buffet-life-parenting-1yearhalf': '育児1年半の記録｜寝不足・子どもの入院・仕事との両立',
  'commu-type-check': 'Google AI Studioでコミュ力診断アプリを作った開発記',
  'line-stamp02_release': '子どもモチーフのLINEスタンプ第2弾｜制作・販売のお知らせ',
  'line-stamp_release': '子どもモチーフのLINEスタンプを制作｜元気120％りちゅくん',
  'stacknagoya3-report': 'Stack Nagoya Fes Vol.3参加レポート｜CMS・HTMX・AIの学び',
  'site-renewal': 'WordPressからNext.js・microCMSへ移行した手順と改善点',
};

type BlogSeoSource = {
  id: string;
  title: string;
  description?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export function getResultSeoTitle(result: ResultItem): string {
  if (result.seoTitle?.trim()) return result.seoTitle.trim();
  if (RESULT_SEO_TITLES[result.id]) return RESULT_SEO_TITLES[result.id];

  const technologies = parseTechStack(result.techStack).slice(0, 2).join('・');
  const qualifier = technologies || safeGetProjectType(result);
  return qualifier && qualifier !== '未分類' ? `${result.title}の制作実績｜${qualifier}` : `${result.title}の制作実績`;
}

export function getResultSeoDescription(result: ResultItem): string {
  if (result.seoDescription?.trim()) return createMetaDescription(result.seoDescription, 180);
  if (RESULT_SEO_DESCRIPTIONS[result.id]) return RESULT_SEO_DESCRIPTIONS[result.id];
  return createMetaDescription(result.summary, 180);
}

export function getBlogSeoTitle(blog: BlogSeoSource): string {
  return blog.seoTitle?.trim() || BLOG_SEO_TITLES[blog.id] || blog.title;
}

export function getBlogSeoDescription(blog: BlogSeoSource): string {
  return createMetaDescription(blog.seoDescription?.trim() || blog.description, 180);
}
