import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function load(relative, client) {
  const filename = path.resolve(relative);
  const mod = { exports: {} };
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
  const localRequire = id => {
    if (id === 'microcms-js-sdk') return { createClient: () => client };
    if (id.startsWith('@/')) {
      const file = path.resolve(id.slice(2));
      return load(existsSync(file + '.ts') ? file + '.ts' : file + '.tsx', client);
    }
    return require(id);
  };
  runInNewContext(code, { module: mod, exports: mod.exports, require: localRequire, console, URL, URLSearchParams, process: { env: { MICROCMS_SERVICE_DOMAIN: 'test-fixture', MICROCMS_API_KEY: 'fixture-only' } } });
  return mod.exports;
}

const ids = items => Array.from(items, item => item.id);
const { compareContentNewest } = load('lib/contentOrder.ts');

test('公開日を優先し、更新日・制作期間で新着を上書きしない', () => {
  const items = [
    { id: 'updated', publishedAt: '2025-01-01', createdAt: '2025-01-01', updatedAt: '2030-01-01', period: 99 },
    { id: 'published', publishedAt: '2026-02-01', createdAt: '2024-01-01' },
    { id: 'created-later', publishedAt: '2026-01-01', createdAt: '2026-01-01' },
  ];
  assert.deepEqual(ids([...items].sort(compareContentNewest)), ['published', 'created-later', 'updated']);
  assert.deepEqual(ids(items), ['updated', 'published', 'created-later']);
});

test('欠損・無効な公開日は作成日で補い、日付なしは最後、同日時はIDで安定する', () => {
  const items = [
    { id: 'z', publishedAt: '2026-01-01T09:00:00+09:00', createdAt: '2025-01-01' },
    { id: 'none-b', publishedAt: null, createdAt: null },
    { id: 'created', publishedAt: null, createdAt: '2027-01-01' },
    { id: 'invalid', publishedAt: 'invalid', createdAt: '2026-06-01' },
    { id: 'a', publishedAt: '2026-01-01T00:00:00Z', createdAt: '2025-01-01' },
    { id: 'same-date-created-later', publishedAt: '2026-01-01', createdAt: '2025-02-01' },
    { id: 'none-a', publishedAt: '', createdAt: 'invalid' },
  ];
  const expected = ['created', 'invalid', 'same-date-created-later', 'a', 'z', 'none-a', 'none-b'];
  assert.deepEqual(ids([...items].sort(compareContentNewest)), expected);
  assert.deepEqual(ids([...items].reverse().sort(compareContentNewest)), expected);
});

function api(items) {
  const calls = [];
  const filter = queries => items.filter(item => (!queries.filters?.includes('category[equals]activity') || item.category?.id === 'activity')
    && (!queries.q || item.title.includes(queries.q))
    && (!queries.ids || (Array.isArray(queries.ids) ? queries.ids : queries.ids.split(',')).includes(item.id)));
  const client = {
    getList: async ({ endpoint, queries, customRequestInit }) => {
      calls.push({ endpoint, queries, customRequestInit });
      // 管理画面順を返し、ページ内sortだけでは直らない100件超の境界を検証する。
      const matched = filter(queries);
      const contents = matched.slice(queries.offset ?? 0, (queries.offset ?? 0) + (queries.limit ?? 10))
        .map(item => Object.fromEntries(queries.fields.split(',').filter(key => key in item).map(key => [key, item[key]])));
      return { contents, totalCount: matched.length, offset: queries.offset ?? 0, limit: queries.limit ?? 10 };
    },
    getAllContents: async ({ queries }) => filter(queries).map(item => ({ ...item })),
  };
  return { ...load('app/_libs/microcms.ts', client), calls };
}

const manyItems = () => [
  ...Array.from({ length: 123 }, (_, i) => ({ id: `content-${String(123 - i).padStart(3, '0')}`, title: `開発 ${i}`, publishedAt: '2026-01-01', createdAt: '2025-01-01', category: { id: 'activity' }, content: '一覧には不要な本文', period: i })),
  { id: 'latest-outside-first-100', title: '開発 新着', publishedAt: '2027-01-01', createdAt: '2025-01-01', category: { id: 'activity' } },
  { id: 'missing-publication', title: '開発 旧データ', publishedAt: null, createdAt: '2028-01-01', category: { id: 'activity' } },
];

test('実績は100件超の全候補を新着順にしてからlimit・offsetを適用する', async () => {
  const h = api(manyItems());
  const first = await h.getResults({ limit: 6 });
  assert.deepEqual(ids(first.contents), ['missing-publication', 'latest-outside-first-100', 'content-001', 'content-002', 'content-003', 'content-004']);
  const second = await h.getResults({ limit: 6, offset: 6 });
  assert.deepEqual(ids(second.contents), ['content-005', 'content-006', 'content-007', 'content-008', 'content-009', 'content-010']);
  assert.equal(first.totalCount, 125);
  assert.equal(second.offset, 6);
  assert.deepEqual(h.calls.slice(0, 2).map(call => call.queries.offset), [0, 100]);
  for (const { queries, customRequestInit } of h.calls) {
    assert.equal(queries.orders, '-publishedAt,-createdAt,system:default');
    assert.equal(queries.limit, 100);
    assert.equal(customRequestInit.next.revalidate, 60);
  }
});

test('日記・カテゴリ・検索も新着順で分割し、本文を全件取得しない', async () => {
  const h = api([...manyItems(), { id: 'other-category', title: '対象外', category: { id: 'other' }, publishedAt: '2030-01-01' }]);
  const options = { limit: 10, offset: 10, q: '開発', filters: 'category[equals]activity' };
  const result = await h.getBlogList(options);
  assert.deepEqual(ids(result.contents), Array.from({ length: 10 }, (_, i) => `content-${String(i + 9).padStart(3, '0')}`));
  assert.equal(result.totalCount, 125);
  assert.equal(result.contents.some(item => 'content' in item), false);
  assert.equal(h.calls[0].queries.q, options.q);
  assert.equal(h.calls[0].queries.filters, options.filters);
});

test('日記のfields指定でも並べ替え用の日付を取得し、対象IDだけを残す', async () => {
  const h = api(manyItems());
  const result = await h.getBlogList({ ids: 'content-001,latest-outside-first-100', fields: 'id,title', limit: 1 });
  assert.deepEqual(ids(result.contents), ['latest-outside-first-100']);
  assert.equal(result.totalCount, 2);
  assert.match(h.calls[0].queries.fields, /publishedAt,createdAt/);
});

test('明示した制作期間順と全件取得は既存用途を維持する', async () => {
  const items = [{ id: 'new', title: '新しい案件', publishedAt: '2027-01-01', period: 1 }, { id: 'long', title: '長期間の案件', publishedAt: '2025-01-01', period: 10 }];
  const h = api(items);
  assert.deepEqual(ids((await h.getResults({ sort: 'periodDesc' })).contents), ['long', 'new']);
  assert.deepEqual(ids(await h.getAllResultList()), ['new', 'long']);
  assert.deepEqual(ids(await h.getAllBlogList()), ['new', 'long']);
});
