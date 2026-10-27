import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { createDiaryHarness } from './helpers/diaryPageHarness.mjs';

test('日記ページ送りは末尾スラッシュの有無にかかわらず有効な同一パスを生成する', async () => {
  for (const basePath of ['/diary/', '/diary', '/diary/category/activity/']) {
    const h = createDiaryHarness({});
    const Pagination = h.load('app/_components/Pagination/index.tsx').default;
    const root = basePath.startsWith('/diary/category') ? '/diary/category/activity' : '/diary';
    const html = await h.render(createElement(Pagination, { totalCount: 40, current: 3, basePath }));
    assert.doesNotMatch(html, /href="[^"]*\/\//);
    assert.ok(html.includes(`href="${root}"`));
    assert.ok(html.includes(`href="${root}/p/2"`));
    assert.ok(html.includes(`href="${root}/p/4"`));
  }
});

test('目次はCMSの既存IDと本文アンカーを保持し、生成IDの衝突を避ける', () => {
  const h = createDiaryHarness({});
  const { addHeadingIds } = h.load('lib/tableOfContents.ts');
  const html = '<h2>新規見出し</h2><h2 id="section-1">既存見出し</h2><h3 id=custom-anchor tabindex=0>既存小見出し</h3><p id="section-2"><a href="#custom-anchor">本文リンク</a></p>';
  const output = addHeadingIds(html);
  assert.deepEqual(JSON.parse(JSON.stringify(output.items)), [
    { id: 'section-3', title: '新規見出し', level: 2 },
    { id: 'section-1', title: '既存見出し', level: 2 },
    { id: 'custom-anchor', title: '既存小見出し', level: 3 },
  ]);
  assert.match(output.content, /<h3[^>]*id=custom-anchor[^>]*tabindex="-1"/);
  assert.match(output.content, /href="#custom-anchor"/);
  assert.equal((output.content.match(/id="section-1"/g) || []).length, 1);
});

test('目次は引用符・実体参照を含む既存IDを変更せずリンクの値を復元する', () => {
  const h = createDiaryHarness({});
  const output = h.load('lib/tableOfContents.ts').addHeadingIds('<h2 id="design&amp;build">設計</h2><h3 id=\'details\'>詳細</h3>');
  assert.equal(output.items[0].id, 'design&build');
  assert.equal(output.items[1].id, 'details');
  assert.match(output.content, /id="design&amp;build"/);
});

test('目次は既存IDの後でも衝突しない従来の生成アンカー番号を維持する', () => {
  const h = createDiaryHarness({});
  const output = h.load('lib/tableOfContents.ts').addHeadingIds('<h2 id="cms-anchor">既存</h2><h2>生成対象</h2><p><a href="#section-2">従来の本文リンク</a></p>');
  assert.equal(output.items[1].id, 'section-2');
  assert.match(output.content, /href="#section-2"/);
});

test('実績JSON-LDのaboutは登録済み名称だけをThingとして表す', async () => {
  const h = createDiaryHarness({});
  const result = { id: 'example', title: '実績', summary: '概要', workType: ['副業'], 'project-roles': ['実装', '未分類'], publishedAt: '2026-01-01', updatedAt: '2026-01-02' };
  const Component = h.load('app/_components/ResultJsonLd/index.tsx').default;
  const html = await h.render(createElement(Component, { result }));
  const json = JSON.parse(html.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1]);
  assert.deepEqual(json.about, [{ '@type': 'Thing', name: '副業' }, { '@type': 'Thing', name: '実装' }]);
  const emptyHtml = await h.render(createElement(Component, { result: { ...result, workType: undefined, 'project-roles': undefined } }));
  assert.deepEqual(JSON.parse(emptyHtml.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1]).about, []);
});
