// 検証専用のjsdomを外部から指定。製品依存と秘密値は使用しない。
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const { JSDOM } = require(process.env.JSDOM_MODULE || 'jsdom');
const dom = new JSDOM('<!doctype html><html lang="ja"><body><div id="app"></div></body></html>', { pretendToBeVisual: true, url: 'http://localhost/' });
let width = 390;
const media = [];
const matchMedia = query => {
  const listeners = new Set();
  const value = { media: query, get matches() { return query.includes('min-width:768') ? width >= 768 : false; }, addEventListener: (_, listener) => listeners.add(listener), removeEventListener: (_, listener) => listeners.delete(listener), listeners };
  media.push(value);
  return value;
};
for (const name of ['window', 'document', 'HTMLElement', 'Element', 'Node', 'DOMParser', 'Event', 'CustomEvent', 'MutationObserver']) globalThis[name] = dom.window[name];
globalThis.matchMedia = dom.window.matchMedia = matchMedia;
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement, act } = await import('react');
const { createRoot } = await import('react-dom/client');
const componentModule = { exports: {} };
const code = ts.transpileModule(readFileSync('app/_components/CardSlider/index.tsx', 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
}).outputText;
runInNewContext(code, { module: componentModule, exports: componentModule.exports, require: name => /\.(scss|css)$|\/css\//.test(name) ? {} : require(name), document, window });
const CardSlider = componentModule.exports.default;
const root = createRoot(document.getElementById('app'));
const cards = count => Array.from({ length: count }, (_, i) => createElement('li', { className: 'splide__slide', key: i }, createElement('a', { href: `/diary/${i}/` }, `記事 ${i}`)));
const render = async count => act(async () => { root.render(createElement(CardSlider, { kind: 'diary', label: '関連記事', previous: '前の記事', next: '次の記事' }, cards(count))); });
const resize = async value => act(async () => {
  const previous = new Map(media.map(query => [query, query.matches]));
  width = value;
  // 実ブラウザー同様、条件が変わったメディアクエリーだけchangeを通知する。
  for (const query of [...media]) if (previous.get(query) !== query.matches) {
    for (const listener of [...query.listeners]) listener.call(query, { matches: query.matches });
  }
});
const checkList = active => {
  const list = document.querySelector('.splide__list');
  assert.equal(list.getAttribute('role'), 'list', 'ulは一覧の意味を維持する');
  for (const slide of list.children) {
    assert.ok(!slide.hasAttribute('role') || slide.getAttribute('role') === 'listitem', 'liに許可されないgroupを指定しない');
    if (active) {
      assert.equal(slide.getAttribute('aria-roledescription'), 'カード');
      assert.match(slide.getAttribute('aria-label'), /枚目 \/ 全3枚/);
    }
  }
  assert.equal(document.querySelector('.card-slider').getAttribute('aria-label'), '関連記事');
};
try {
  await render(3);
  checkList(true);
  await resize(1440);
  checkList(false);
  assert.equal(document.querySelectorAll('.card-slider a[tabindex="-1"]').length, 0, 'PCではリンクのtabindexを復元する');
  await resize(390);
  checkList(true);
  await render(1);
  assert.equal(document.querySelector('.splide__arrows'), null, '1枚では操作ボタンを出さない');
  assert.equal(document.querySelector('ul').getAttribute('aria-label'), '関連記事');
  assert.equal(document.querySelector('li').getAttribute('role'), null, '1枚は通常のリスト項目');
  await render(0);
  assert.equal(document.getElementById('app').innerHTML, '', '0枚は表示しない');
  await resize(1440);
  await render(3);
  checkList(false);
  await resize(390);
  checkList(true);
  console.log('成功: 実際のReact/SplideによるSP→PC→SPのリスト意味・ラベル・tabindex復元・1枚/0枚');
} finally { await act(async () => root.unmount()); dom.window.close(); }
