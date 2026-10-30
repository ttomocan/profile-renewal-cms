import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { createDiaryHarness } from './helpers/diaryPageHarness.mjs';

const date = '2026-01-01T00:00:00.000Z';
const category = { id: 'activity', name: '活動記録', createdAt: date, updatedAt: date };
const blogs = [1, 2, 3].map(n => ({ id: `article-${n}`, title: `記事${n}`, description: '記事の概要', content: '<p>本文</p>', category, publishedAt: date, createdAt: date, updatedAt: date, thumbnail: { url: `/img/article-${n}.jpg`, width: 1200, height: 800 } }));
const cms = {
  getBlogList: async () => ({ contents: blogs, totalCount: 24, offset: 0, limit: 10 }),
  getResults: async () => ({ contents: [], totalCount: 0, offset: 0, limit: 12 }),
  getCategoryDetail: async () => category,
  getAllCategoryList: async () => [category],
};
const images = html => [...html.matchAll(/<img\b[^>]*>/g)].map(m => m[0].replace(/(?:%[0-9a-f]{2})+/gi, value => decodeURIComponent(value)));
const loading = img => img.match(/\bloading="([^"]+)"/)?.[1];
async function render(file, props = {}, source = cms) {
  const h = createDiaryHarness(source);
  const Component = h.load(file).default;
  return h.render(createElement(Component, props));
}

test('常時表示するロゴは即時取得し、SNSはPCだけ先行取得する', async () => {
  const html = await render('app/_components/Header/index.tsx');
  assert.equal(loading(images(html).find(img => img.includes('/img/common/h_logo.png'))), 'eager');
  const preloads = [...html.matchAll(/<link\b[^>]*rel="preload"[^>]*>/g)].map(m => m[0]).filter(tag => tag.includes('/img/common/icon_'));
  assert.equal(preloads.length, 3);
  for (const tag of preloads) assert.match(tag, /media="\(min-width: 1041px\)"/);
  for (const img of images(html).filter(img => img.includes('/img/common/icon_'))) assert.equal(loading(img), 'lazy');
});

test('トップはKVと似顔絵を即時取得し、下層セクション画像を遅延取得する', async () => {
  const html = await render('app/page.tsx', {}, { ...cms, getBlogList: async () => ({ contents: [] }) });
  const tags = images(html);
  const hero = tags.find(img => img.includes('/img/pages/top/img_hero.webp'));
  assert.equal(loading(hero), 'eager');
  assert.match(hero, /fetchPriority="high"/);
  const portraits = tags.filter(img => img.includes('/img/pages/top/img_tomocan.jpg'));
  assert.equal(loading(portraits[0]), 'eager');
  assert.equal(loading(portraits[1]), 'lazy');
  assert.equal(loading(tags.find(img => img.includes('img_programming.jpg'))), 'lazy');
});

test('Aboutの最初の写真は遅延取得や透明な登場待ちをしない', async () => {
  const html = await render('app/about/page.tsx');
  assert.equal(loading(images(html).find(img => img.includes('/img/pages/about/img_tomocan.jpg'))), 'eager');
  assert.match(html, /class="greeting__image"/);
});

test('記事詳細のアイキャッチは即時取得し、本文幅に合う候補サイズを通知する', async () => {
  const html = await render('app/_components/Article/index.tsx', { data: blogs[0] });
  const img = images(html)[0];
  assert.equal(loading(img), 'eager');
  assert.match(img, /sizes="\(max-width: 767px\) calc\(100vw - 40px\), 720px"/);
});

test('通常・関連記事の一覧画像はlazyのまま、FV対象の一覧だけ先頭を即時取得する', async () => {
  const lazy = images(await render('app/_components/DiaryList/index.tsx', { blog: blogs }));
  assert.deepEqual(lazy.map(loading), ['lazy', 'lazy', 'lazy']);
  const eager = images(await render('app/_components/DiaryList/index.tsx', { blog: blogs, eagerFirstImage: true }));
  assert.deepEqual(eager.map(loading), ['eager', 'lazy', 'lazy']);
  assert.match(eager[0], /sizes="\(max-width: 480px\) calc\(100vw - 74px\), \(max-width: 767px\) 120px, 200px"/);
  const fallback = images(await render('app/_components/DiaryList/index.tsx', { blog: [{ ...blogs[0], thumbnail: undefined }], eagerFirstImage: true }));
  assert.equal(loading(fallback[0]), 'eager');
});

for (const [file, props] of [
  ['app/diary/p/[current]/page.tsx', { params: Promise.resolve({ current: '2' }) }],
  ['app/diary/category/[id]/page.tsx', { params: Promise.resolve({ id: 'activity' }) }],
  ['app/diary/category/[id]/p/[current]/page.tsx', { params: Promise.resolve({ id: 'activity', current: '2' }) }],
  ['app/diary/search/page.tsx', { searchParams: Promise.resolve({ q: '記事' }) }],
  ['app/diary/page.tsx', { searchParams: Promise.resolve({ category: 'activity' }) }],
]) {
  test(`${file}: 検索・カテゴリ・ページ送りの先頭サムネイルを即時取得する`, async () => {
    const tags = images(await render(file, props)).filter(img => /\/img\/article-/.test(img));
    assert.deepEqual(tags.map(loading), ['eager', 'lazy', 'lazy']);
  });
}

test('実績一覧の先頭だけ即時表示し、後続カードとスライダー用既定値はlazyを保つ', async () => {
  const contents = [1, 2, 3].map(n => ({ id: `project-${n}`, title: `実績${n}`, summary: '概要', publishedAt: date, updatedAt: date, cover: { url: `/img/project-${n}.jpg`, width: 800, height: 450 } }));
  const html = await render('app/result/_components/ResultArchive.tsx', { currentPage: 2, resultsData: { contents, totalCount: 24, offset: 12, limit: 12 } });
  assert.deepEqual(images(html).filter(img => img.includes('/img/project-')).map(loading), ['eager', 'lazy', 'lazy']);
  assert.match(html, /<article class="result-card">/);
  const card = await render('components/ResultCard.tsx', { result: contents[0] });
  assert.equal(loading(images(card)[0]), 'lazy');
});

test('ルートの初期HTMLに画像を覆う全画面ローディング幕を出さない', async () => {
  const html = await render('app/layout.tsx', { children: createElement('main', { id: 'main' }, '本文') });
  assert.doesNotMatch(html, /<div class="loading"/);
  assert.match(html, /<main id="main">本文<\/main>/);
});

test('画面下端に一部見えている画像もスクロールなしで登場処理を開始する', () => {
  const classes = new Set();
  const element = { getBoundingClientRect: () => ({ top: 730 }), classList: { add: value => classes.add(value) } };
  const effects = [];
  const body = { classList: { add() {}, remove() {} }, hasAttribute: () => false, removeAttribute() {} };
  const componentModule = { exports: {} };
  const code = ts.transpileModule(readFileSync(new URL('../app/DynamicBodyClass.tsx', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  runInNewContext(code, {
    module: componentModule, exports: componentModule.exports,
    require: id => id === 'react' ? { useEffect: effect => effects.push(effect) } : { usePathname: () => '/' },
    document: { body, querySelectorAll: selector => selector === '.fadeUpTrigger' ? [element] : [] },
    window: { pageYOffset: 0, scrollY: 0, innerHeight: 757, addEventListener() {}, removeEventListener() {} },
    MutationObserver: class { observe() {} disconnect() {} },
    setTimeout: callback => { callback(); return 1; }, clearTimeout() {}, requestAnimationFrame: callback => callback(),
  });
  componentModule.exports.default();
  effects[0]();
  assert.ok(classes.has('fadeUp'), 'y=730pxの画像は757pxの画面に入っている');
});
