import assert from 'node:assert/strict';
import test from 'node:test';
import { createDiaryHarness } from './helpers/diaryPageHarness.mjs';

const category = { id: 'activity', name: '活動記録' };
const article = (id, title) => ({ id, title, description: `${title}の概要`, category, publishedAt: '2025-10-21', content: '<p>CMSの本文</p>' });
const relatedArticles = [article('iropon-release', 'CMSのいろポン記事'), article('commu-type-check', 'CMSのコミュ力記事'), article('site-renewal', 'CMSのリニューアル記事')];
const lifestyle = article('work-childcare-balance', '育児と暮らしの記事');
const hrefs = html => [...html.matchAll(/href="([^"]+)"/g)].map(([, href]) => href.replace(/\/$/, ''));

function fixture({ blog = [lifestyle] } = {}) {
  const calls = [];
  const harness = createDiaryHarness({
    getAllCategoryList: async () => [category],
    getCategoryDetail: async id => ({ ...category, id }),
    getBlogList: async queries => {
      calls.push(JSON.parse(JSON.stringify(queries)));
      return { contents: blog, totalCount: blog.length, offset: 0, limit: 10 };
    },
  });
  return { ...harness, calls };
}

test('日記一覧はおすすめ枠と専用取得を持たず、元記事・検索・カテゴリ導線を保持する', async () => {
  const h = fixture({ blog: [lifestyle, ...relatedArticles] });
  const page = h.load('app/diary/page.tsx');
  const html = await h.render(await page.default({ searchParams: Promise.resolve({}) }));
  assert.doesNotMatch(html, /開発・学習のおすすめ記事|recommended-articles-heading|recommendedLink/);
  for (const item of relatedArticles) assert.ok(hrefs(html).includes(`/diary/${item.id}`));
  assert.match(html, /育児と暮らしの記事/);
  assert.match(html, /dateTime="2025-10-21"/);
  assert.match(html, /action="\/diary\/search\/" method="get"/);
  assert.match(html, /type="search"[^>]*name="q"/);
  assert.match(html, /id="diary-category"/);
  assert.deepEqual(h.calls, [{ limit: 10 }]);
});

test('日記ルートの検索・カテゴリ指定は既存CMS条件を保持し、おすすめを混ぜない', async () => {
  const h = fixture();
  const html = await h.render(await h.load('app/diary/page.tsx').default({ searchParams: Promise.resolve({ q: 'Next.js', category: 'activity' }) }));
  assert.doesNotMatch(html, /開発・学習のおすすめ記事/);
  assert.deepEqual(h.calls, [{ limit: 10, q: 'Next.js', filters: 'category[equals]activity' }]);
  assert.match(html, /value="Next.js"/);
  assert.match(html, /value="activity" selected=""/);
});

test('検索専用ルートはqと検索結果・件数を保持する', async () => {
  const h = fixture({ blog: [relatedArticles[0]] });
  const html = await h.render(await h.load('app/diary/search/page.tsx').default({ searchParams: Promise.resolve({ q: '色彩' }) }));
  assert.deepEqual(h.calls, [{ limit: 10, q: '色彩' }]);
  assert.match(html, /色彩/);
  assert.match(html, /検索結果: 1件/);
  assert.ok(hrefs(html).includes('/diary/iropon-release'));
  assert.doesNotMatch(html, /開発・学習のおすすめ記事/);
});

test('カテゴリ専用ルートと表示フォームは既存URLとフィルタを保持する', async () => {
  const h = fixture();
  const html = await h.render(await h.load('app/diary/category/[id]/page.tsx').default({ params: Promise.resolve({ id: 'activity' }) }));
  assert.deepEqual(h.calls, [{ limit: 10, filters: 'category[equals]activity' }]);
  assert.match(html, /育児と暮らしの記事/);
  assert.doesNotMatch(html, /開発・学習のおすすめ記事/);
  const Filter = h.load('app/_components/CategoryFilter/index.tsx').default;
  const { createElement } = await import('react');
  const formHtml = await h.render(createElement(Filter, { categories: [category], selectedCategoryId: 'activity' }));
  assert.match(formHtml, /<form[^>]*action="\/diary\/"[^>]*method="get"/);
  assert.match(formHtml, /<select[^>]*name="category"/);
  assert.match(formHtml, /value="activity" selected=""/);
  assert.match(formHtml, /<button[^>]*type="submit"/);
});

test('site-renewalのSEOタイトルは本文にない手順・改善点をうたわずCMS優先を保持する', () => {
  const h = fixture();
  const seo = h.load('lib/contentSeo.ts');
  assert.equal(seo.getBlogSeoTitle({ id: 'site-renewal', title: 'CMSのH1' }), 'WordPressからNext.js＋microCMSへリニューアルした記録');
  assert.equal(seo.getBlogSeoTitle({ id: 'site-renewal', title: 'CMSのH1', seoTitle: ' CMSで編集したSEOタイトル ' }), 'CMSで編集したSEOタイトル');
});

for (const technical of [false, true]) {
  test(`日記詳細は同カテゴリカードを残し関連ページを表示しない：技術記事=${technical}`, async () => {
    const current = article('current', technical ? 'Next.jsで制作した記事' : '育児の記事');
    const calls = [];
    const h = createDiaryHarness({
      getBlogDetail: async () => current,
      getBlogList: async query => { calls.push(JSON.parse(JSON.stringify(query))); return { contents: [current, ...relatedArticles] }; },
      getResults: async () => { throw new Error('関連ページ削除後は実績を取得しない'); },
    });
    const html = await h.render(await h.load('app/diary/[slug]/page.tsx').default({ params: Promise.resolve({ slug: 'current' }), searchParams: Promise.resolve({}) }));
    assert.deepEqual(calls, [{ limit: 4, filters: 'category[equals]activity' }]);
    assert.match(html, /同じカテゴリーの関連記事/);
    assert.match(html, /aria-label="記事一覧"/);
    assert.doesNotMatch(html, /related-pages-heading/);
    assert.match(html, /CMSの本文/);
    for (const item of relatedArticles) assert.ok(hrefs(html).includes(`/diary/${item.id}`));
    assert.equal((html.match(/aria-label="記事「/g) || []).length, 3);
  });
}

test('日記詳細は同カテゴリの他記事がない場合に空カード領域を作らない', async () => {
  const current = article('only', '唯一の記事');
  const h = createDiaryHarness({ getBlogDetail: async () => current, getBlogList: async () => ({ contents: [current] }) });
  const html = await h.render(await h.load('app/diary/[slug]/page.tsx').default({ params: Promise.resolve({ slug: 'only' }), searchParams: Promise.resolve({}) }));
  assert.doesNotMatch(html, /related-articles-heading|related-pages-heading|記事がありません/);
  assert.match(html, /活動記録の一覧へ/);
});
