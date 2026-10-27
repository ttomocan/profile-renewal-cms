// ローカル検証専用。実CMSと認証情報は使用しない。
require('../../scripts/performance/cms-fixture.cjs');
const fixtureFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const response = await fixtureFetch(input, init);
  const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url);
  if (url.hostname !== 'profile-perf-fixture.microcms.io' || !url.pathname.includes('/blog/')) return response;
  const data = await response.json();
  if (data.content) {
    data.content = data.content.replace('<h2>', '<h2 id="cms-anchor">')
      + '<h3 id="design&amp;build">設計と実装</h3><p><a href="#cms-anchor">冒頭見出しへ</a></p>';
  }
  return Response.json(data, { status: response.status });
};
