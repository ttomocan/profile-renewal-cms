import assert from 'node:assert/strict';
import test from 'node:test';
import { loadSeoModule } from './helpers/loadSeoModule.mjs';

const category = { id: 'development', name: '開発' };
const blog = { id: 'entry', title: '公開記事', description: '記事の説明', category };
const notFoundError = new Error('NEXT_HTTP_ERROR_FALLBACK;404');
const redirectError = new Error('NEXT_REDIRECT');
const sdkError = status => new Error(`fetch API response status: ${status}`);
const routeCases = [
  { name: '日記詳細', path: 'app/diary/[slug]/page.tsx', detail: 'getBlogDetail', params: { slug: 'entry' } },
  { name: 'カテゴリ', path: 'app/diary/category/[id]/page.tsx', detail: 'getCategoryDetail', params: { id: 'development' } },
  { name: 'カテゴリ2ページ目', path: 'app/diary/category/[id]/p/[current]/page.tsx', detail: 'getCategoryDetail', params: { id: 'development', current: '2' } },
];

function loadRoute(route, cmsOverrides = {}) {
  const components = ['Article', 'Breadcrumb', 'BlogPostJsonLd', 'BreadcrumbListJsonLd', 'DiaryList', 'Pagination', 'Category'];
  const jsx = (type, props) => ({ type, props });
  return loadSeoModule(route.path, {
    'next/navigation': { notFound: () => { throw notFoundError; }, permanentRedirect: () => { throw redirectError; } },
    'next/link': () => null,
    'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'fragment' },
    '@/lib/parse': { parseStrictPageNumber: value => /^[1-9]\d*$/.test(value) && Number.isSafeInteger(Number(value)) ? Number(value) : null },
    '@/app/_libs/microcms': {
      getBlogDetail: async () => blog,
      getCategoryDetail: async () => category,
      getBlogList: async () => ({ contents: [blog], totalCount: 21 }),
      ...cmsOverrides,
    },
    ...Object.fromEntries(components.map(name => [`@/app/_components/${name}`, () => null])),
  });
}

for (const route of routeCases) {
  const props = { params: Promise.resolve(route.params), searchParams: Promise.resolve({}) };
  for (const entrypoint of ['generateMetadata', 'default']) {
    test(`${route.name}/${entrypoint}: コンテンツの404だけをnotFoundにする`, async () => {
      const page = loadRoute(route, { [route.detail]: async () => { throw sdkError(404); } });
      await assert.rejects(page[entrypoint](props), error => error === notFoundError);
    });
    for (const cause of [sdkError(429), sdkError(503), new Error('Network Error. timeout')]) {
      test(`${route.name}/${entrypoint}: ${cause.message}を404・noindexへ変換しない`, async () => {
        const page = loadRoute(route, { [route.detail]: async () => { throw cause; } });
        await assert.rejects(page[entrypoint](props), error => error === cause);
      });
    }
  }
  test(`${route.name}: 正常時のメタ情報を維持する`, async () => {
    const metadata = await loadRoute(route).generateMetadata(props);
    assert.equal(metadata.robots.index, true);
    assert.equal(metadata.robots.follow, true);
    assert.ok(metadata.alternates.canonical.startsWith('https://www.tomocan.site/diary/'));
  });
}

for (const route of routeCases.slice(1)) {
  for (const status of [404, 503]) {
    test(`${route.name}: 記事件数の取得失敗${status}をnoindexの根拠にしない`, async () => {
      const cause = sdkError(status);
      const page = loadRoute(route, { getBlogList: async () => { throw cause; } });
      await assert.rejects(page.generateMetadata({ params: Promise.resolve(route.params) }), error => error === cause);
    });
  }
}

test('日記プレビューのnoindexと公開URLのcanonicalを維持する', async () => {
  const page = loadRoute(routeCases[0]);
  const metadata = await page.generateMetadata({ params: Promise.resolve({ slug: 'entry' }), searchParams: Promise.resolve({ dk: 'test-preview' }) });
  assert.equal(metadata.robots.index, false);
  assert.equal(metadata.alternates.canonical, 'https://www.tomocan.site/diary/entry/');
});

test('実在する少数記事カテゴリの既存noindex方針は変更しない', async () => {
  const route = routeCases[1];
  const page = loadRoute(route, { getBlogList: async () => ({ contents: [blog], totalCount: 2 }) });
  const metadata = await page.generateMetadata({ params: Promise.resolve(route.params) });
  assert.equal(metadata.robots.index, false);
});
