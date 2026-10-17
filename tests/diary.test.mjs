import assert from 'node:assert/strict';
import test from 'node:test';
import { createDiaryHarness } from './helpers/diaryPageHarness.mjs';

const category = { id: 'activity', name: '活動記録' };
const article = (id, title) => ({ id, title, description: `${title}の概要`, category, publishedAt: '2025-10-21', content: '<p>CMSの本文</p>' });
const recommendations = [article('iropon-release', 'CMSのいろポン記事'), article('commu-type-check', 'CMSのコミュ力記事'), article('site-renewal', 'CMSのリニューアル記事')];
const lifestyle = article('work-childcare-balance', '育児と暮らしの記事');
const hrefs = html => [...html.matchAll(/href="([^"]+)"/g)].map(([, href]) => href.replace(/\/$/, ''));

function fixture({ recommended = recommendations, failRecommendations = false, blog = [lifestyle] } = {}) {
  const calls = [];
  const harness = createDiaryHarness({
    getAllCategoryList: async () => [category],
    getCategoryDetail: async id => ({ ...category, id }),
    getBlogList: async queries => {
      calls.push(JSON.parse(JSON.stringify(queries)));
      if (queries.ids) {
        if (failRecommendations) throw new Error('recommended CMS request failed');
        return { contents: recommended, totalCount: recommended.length };
      }
      return { contents: blog, totalCount: blog.length, offset: 0, limit: 10 };
    },
  });
  return { ...harness, calls };
}

test('日記上部のおすすめ3記事はCMSタイトルを使い、暮らし記事と検索・カテゴリ導線を保持する', async () => {
  const h = fixture({ recommended: [...recommendations].reverse() });
  const page = h.load('app/diary/page.tsx');
  const html = await h.render(await page.default({ searchParams: Promise.resolve({}) }));
  assert.match(html, /開発・学習のおすすめ記事/);
  const section = html.match(/<section[^>]*aria-labelledby="recommended-articles-heading"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section);
  assert.deepEqual(hrefs(section), ['/diary/iropon-release', '/diary/commu-type-check', '/diary/site-renewal']);
  for (const item of recommendations) assert.ok(section.includes(item.title));
  assert.ok(html.indexOf(section) < html.indexOf('role="search"'));
  assert.match(html, /育児と暮らしの記事/);
  assert.match(html, /dateTime="2025-10-21"/);
  assert.match(html, /action="\/diary\/search\/" method="get"/);
  assert.match(html, /type="search"[^>]*name="q"/);
  assert.match(html, /id="diary-category"/);
  assert.deepEqual(h.calls.find(q => q.ids), { ids: 'iropon-release,commu-type-check,site-renewal', limit: 3, fields: 'id,title,description' });
  assert.deepEqual(h.calls.find(q => !q.ids), { limit: 10 });
});

for (const options of [{ recommended: recommendations.slice(0, 2) }, { recommended: [] }, { failRecommendations: true }]) {
  test(`おすすめが${options.failRecommendations ? '取得失敗' : options.recommended.length + '件'}でも存在する記事だけ表示し通常一覧を保持する`, async () => {
    const h = fixture(options);
    const html = await h.render(await h.load('app/diary/page.tsx').default({ searchParams: Promise.resolve({}) }));
    assert.match(html, /育児と暮らしの記事/);
    const count = options.failRecommendations ? 0 : options.recommended.length;
    assert.equal(html.includes('開発・学習のおすすめ記事'), count > 0);
    if (count === 2) assert.ok(!hrefs(html).includes('/diary/site-renewal'));
  });
}

test('日記ルートの検索・カテゴリ指定は既存CMS条件を保持し、おすすめを混ぜない', async () => {
  const h = fixture();
  const html = await h.render(await h.load('app/diary/page.tsx').default({ searchParams: Promise.resolve({ q: 'Next.js', category: 'activity' }) }));
  assert.doesNotMatch(html, /開発・学習のおすすめ記事/);
  assert.deepEqual(h.calls, [{ limit: 10, q: 'Next.js', filters: 'category[equals]activity' }]);
  assert.match(html, /value="Next.js"/);
  assert.match(html, /value="activity" selected=""/);
});

test('検索専用ルートはqと検索結果・件数を保持する', async () => {
  const h = fixture({ blog: [recommendations[0]] });
  const html = await h.render(await h.load('app/diary/search/page.tsx').default({ searchParams: Promise.resolve({ q: '色彩' }) }));
  assert.deepEqual(h.calls, [{ limit: 10, q: '色彩' }]);
  assert.match(html, /色彩/);
  assert.match(html, /検索結果: 1件/);
  assert.ok(hrefs(html).includes('/diary/iropon-release'));
  assert.doesNotMatch(html, /開発・学習のおすすめ記事/);
});

test('カテゴリ専用ルートと選択操作は既存URLとフィルタを保持する', async () => {
  const h = fixture();
  const html = await h.render(await h.load('app/diary/category/[id]/page.tsx').default({ params: Promise.resolve({ id: 'activity' }) }));
  assert.deepEqual(h.calls, [{ limit: 10, filters: 'category[equals]activity' }]);
  assert.match(html, /育児と暮らしの記事/);
  assert.doesNotMatch(html, /開発・学習のおすすめ記事/);
  const filter = h.load('app/_components/CategoryFilter/index.tsx').default({ categories: [category] });
  const component = filter.props.children;
  const select = component.type(component.props).props.children[1].props.children[0];
  select.props.onChange({ target: { value: 'activity' } });
  select.props.onChange({ target: { value: 'all' } });
  assert.deepEqual(h.navigation, ['/diary/category/activity/', '/diary/']);
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
      getBlogList: async query => { calls.push(JSON.parse(JSON.stringify(query))); return { contents: [current, ...recommendations] }; },
      getResults: async () => { throw new Error('関連ページ削除後は実績を取得しない'); },
    });
    const html = await h.render(await h.load('app/diary/[slug]/page.tsx').default({ params: Promise.resolve({ slug: 'current' }), searchParams: Promise.resolve({}) }));
    assert.deepEqual(calls, [{ limit: 4, filters: 'category[equals]activity' }]);
    assert.match(html, /同じカテゴリーの関連記事/);
    assert.match(html, /aria-label="記事一覧"/);
    assert.doesNotMatch(html, /related-pages-heading/);
    assert.match(html, /CMSの本文/);
    for (const item of recommendations) assert.ok(hrefs(html).includes(`/diary/${item.id}`));
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
