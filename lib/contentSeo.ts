import { parseTechStack, safeGetProjectType } from '@/lib/parse';
import { createMetaDescription } from '@/lib/seo';
import type { ResultItem } from '@/types/results';

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

  const technologies = parseTechStack(result.techStack).slice(0, 2).join('・');
  const qualifier = technologies || safeGetProjectType(result);
  return qualifier && qualifier !== '未分類' ? `${result.title}の制作実績｜${qualifier}` : `${result.title}の制作実績`;
}

export function getResultSeoDescription(result: ResultItem): string {
  if (result.seoDescription?.trim()) return createMetaDescription(result.seoDescription, 180);
  return createMetaDescription(result.summary, 180);
}

export function getBlogSeoTitle(blog: BlogSeoSource): string {
  return blog.seoTitle?.trim() || BLOG_SEO_TITLES[blog.id] || blog.title;
}

export function getBlogSeoDescription(blog: BlogSeoSource): string {
  return createMetaDescription(blog.seoDescription?.trim() || blog.description, 180);
}
