import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { loadDetail, loadPage } from './helpers/resultPageHarness.mjs';

const oldData = { id: 'corporate-handball-team-01', title: '既存案件', summary: '掲載概要', publishedAt: '2025-01-01', updatedAt: '2025-01-01' };
const params = { params: Promise.resolve({ id: oldData.id }) };

test('旧データ・未入力の任意項目では空の見出しと不明な期間を出さない', async () => {
  const page = loadDetail({ ...oldData, decisions: '  ', verification: '', handover: '\n' });
  const html = renderToStaticMarkup(await page.default(params));
  assert.match(html, /掲載概要/);
  assert.doesNotMatch(html, /期間不明|案件全体の制作期間|実装内容・工夫|実装時の判断と理由|動作・更新手順の確認|公開後の運用・引き継ぎ|使用技術・制作ツール/);
});

test('実装内容・理由・結果・確認・引き継ぎを欠落させず、本文をHTMLとして実行しない', async () => {
  const page = loadDetail({ ...oldData, period: 6, scale: ['101ページ以上'], highlights: '年度別フィルタ', decisions: '判断の説明', results: '確認できた結果', verification: '確認方法', handover: '引き継ぎ内容', technologyUsage: 'PHPの用途', techStack: 'PHP,WordPress,VS Code', responsibility: '<script>個人情報を含まないテスト</script>' });
  const html = renderToStaticMarkup(await page.default(params));
  for (const text of ['年度別フィルタ', '判断の説明', '確認できた結果', '確認方法', '引き継ぎ内容', 'PHPの用途', '案件全体の制作期間', '案件全体のページ規模', 'エディタ・デザインツール']) assert.ok(html.includes(text), text);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>個人情報/);
});

test('案件IDによる古いSEO文で本文と担当範囲を上書きしない', async () => {
  const page = loadDetail(oldData);
  const metadata = await page.generateMetadata(params);
  assert.equal(metadata.description, '掲載概要');
  assert.equal(metadata.openGraph.description, '掲載概要');
  assert.doesNotMatch(metadata.title, /UI設計|速度改善|CMS構築/);
});

test('個人開発記事を取得できなくても既存実績一覧を表示する', async () => {
  const page = loadPage('app/result/page.tsx', {
    getResults: async () => ({ contents: [oldData], totalCount: 1, offset: 0, limit: 9 }),
    getBlogList: async () => { throw new Error('記事取得失敗'); },
  });
  const html = renderToStaticMarkup(await page.default({ searchParams: Promise.resolve({}) }));
  assert.match(html, /既存案件/);
  assert.doesNotMatch(html, /personal-project-heading/);
});
