// 計測専用。製品コードからは読み込まず、架空のCMSホストだけを差し替える。
const { createHash } = require('node:crypto');
if (process.env.MICROCMS_SERVICE_DOMAIN !== 'profile-perf-fixture') {
  throw new Error('固定データの計測環境だけで読み込んでください');
}
const nativeFetch = globalThis.fetch;
const date = '2026-01-01T00:00:00.000Z';
const category = { id: 'activity', name: '活動記録', createdAt: date, updatedAt: date };
const image = { url: '/img/works/newagevoice-home-desktop.jpg', width: 1440, height: 900 };
const ids = ['iropon-release', 'commu-type-check', 'site-renewal', ...Array.from({ length: 11 }, (_, i) => `article-${i + 4}`)];
const blogs = ids.map((id, i) => ({
  id, title: `計測用の開発記録 ${i + 1}`, description: `固定データによる表示と操作の確認用です。記事 ${i + 1} の概要を表示します。`,
  createdAt: date, updatedAt: date, publishedAt: date, revisedAt: date, category,
  ...(i === 5 ? {} : { thumbnail: image }),
  content: '<h2>検証の目的</h2><p>PROFILE_FIXTURE_BODY_ONLY</p>' + Array.from({ length: 100 }, (_, p) =>
    `<p>計測用本文${i + 1}段落${p + 1}。画面には各記事の本文でのみ表示する固定データです。${createHash('sha256').update(`${i}:${p}`).digest('hex')}</p>`).join('') + '<h2>確認結果</h2><p>同条件で比較します。</p>',
}));
const resultIds = ['corporate-handball-team-01', 'risk-management-corporate-01', 'social-entrepreneurship-program-01', 'career-media-01', ...Array.from({ length: 10 }, (_, i) => `project-${i + 5}`)];
const results = resultIds.map((id, i) => ({
  id, title: `計測用の制作実績 ${i + 1}`, summary: 'CMSの実装・改修と更新手順の検証に関する固定の実績概要です。',
  createdAt: date, updatedAt: date, publishedAt: date, revisedAt: date,
  workType: ['メイン業務'], 'project-type': ['コーポレートサイト'], 'project-roles': ['フロントエンド開発', 'CMS構築'],
  ...(i === 5 ? {} : { cover: image }), period: 3, techStack: 'HTML,CSS,PHP,WordPress,VS Code',
  highlights: '更新画面の構築\nレスポンシブ対応', challenge: '複数の画面サイズで確認する。',
  verification: '固定データによる機能確認。',
}));
globalThis.fetch = async (input, init) => {
  const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url);
  if (url.hostname !== 'profile-perf-fixture.microcms.io') return nativeFetch(input, init);
  const [, , , endpoint, id] = url.pathname.split('/');
  let items = endpoint === 'blog' ? blogs : endpoint === 'result' ? results : endpoint === 'categories' ? [category] : [];
  if (id) {
    const item = items.find(item => item.id === id);
    return Response.json(item || { message: '固定データがありません' }, { status: item ? 200 : 404 });
  }
  const q = url.searchParams;
  if (q.has('ids')) items = items.filter(item => q.get('ids').split(',').includes(item.id));
  if (q.has('q')) items = items.filter(item => JSON.stringify(item).includes(q.get('q')));
  if (q.has('filters')) {
    const filters = q.get('filters');
    if (filters.includes('category[equals]')) items = items.filter(item => item.category?.id === filters.split('category[equals]')[1].split('[')[0]);
    if (filters.includes('id[not_equals]')) items = items.filter(item => item.id !== filters.split('id[not_equals]')[1].split('[')[0]);
  }
  const totalCount = items.length, offset = Number(q.get('offset') || 0), limit = Number(q.get('limit') || 10);
  items = items.slice(offset, offset + limit);
  if (q.has('fields')) items = items.map(item => Object.fromEntries(q.get('fields').split(',').filter(key => key in item).map(key => [key, item[key]])));
  return Response.json({ contents: items, totalCount, offset, limit });
};
