import assert from 'node:assert/strict';
import test from 'node:test';
import { loadSeoModule } from './helpers/loadSeoModule.mjs';

function loadLayout(gaId) {
  const GoogleAnalytics = () => null;
  const jsx = (type, props) => ({ type, props });
  const modules = ['./_components/Loading', './_components/Header', './_components/Footer', './_components/PageTop', './DynamicBodyClass', './_components/WebsiteJsonLd', './_components/ClientSmoothScrollProvider'];
  const layout = loadSeoModule('app/layout.tsx', {
    'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'fragment' },
    '@next/third-parties/google': { GoogleAnalytics },
    './fonts': { roboto: { variable: 'test-font' } },
    ...Object.fromEntries(modules.map(name => [name, () => null])),
  }, { process: { env: { NEXT_PUBLIC_GA_ID: gaId } } });
  const collect = element => {
    if (!element || typeof element !== 'object') return [];
    if (Array.isArray(element)) return element.flatMap(collect);
    return [...(element.type === GoogleAnalytics ? [element.props.gaId] : []), ...collect(element.props?.children)];
  };
  return { layout, tags: collect(layout.default({ children: '本文' })) };
}

for (const id of [undefined, '', '   ', 'GTM-TEST123', 'invalid']) {
  test(`測定ID未設定・不正 (${String(id)})ではGAタグを追加しない`, () => {
    assert.deepEqual(loadLayout(id).tags, []);
  });
}

test('明示されたGA4測定IDだけでGoogleAnalyticsを1つ初期化する', () => {
  const { layout, tags } = loadLayout(' G-TEST123456 ');
  assert.deepEqual(tags, ['G-TEST123456']);
  assert.equal(layout.metadata.alternates.canonical, 'https://www.tomocan.site/');
  assert.equal(layout.metadata.robots.index, true);
});
