import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const root = path.resolve('');
function load(relative) {
  const filename = path.resolve(root, relative);
  const componentModule = { exports: {} };
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  const localRequire = id => {
    if (/\.(scss|css)$/.test(id) || id === '@splidejs/splide/css/core') return { __esModule: true, default: {} };
    if (id.startsWith('@/') || id.startsWith('.')) {
      const base = id.startsWith('@/') ? path.join(root, id.slice(2)) : path.resolve(path.dirname(filename), id);
      const file = ['.ts', '.tsx', '/index.ts', '/index.tsx'].map(ext => base + ext).find(existsSync);
      return load(file);
    }
    return require(id);
  };
  runInNewContext(code, { module: componentModule, exports: componentModule.exports, require: localRequire, URL });
  return componentModule.exports;
}
const blog = id => ({ id, title: `記事 ${id}`, category: { id: 'activity', name: '活動記録' }, createdAt: '2025-10-21', description: 'CMSの説明' });
test('日記はSSRでも全カードとリンクを残し、名前付きのスライダーと前後操作を提供する', () => {
  const html = renderToStaticMarkup(createElement(load('app/_components/DiarySlider/index.tsx').default, { blog: [blog('a'), blog('b')] }));
  assert.match(html, /class="[^"]*splide[^"]*"/);
  assert.match(html, /aria-label="活動記録の記事"/);
  assert.match(html, /<ul[^>]*class="[^"]*splide__list/);
  assert.equal((html.match(/class="splide__slide"/g) || []).length, 2);
  assert.match(html, /href="\/diary\/a\/?"/);
  assert.match(html, /href="\/diary\/b\/?"/);
  assert.match(html, /aria-label="前の記事を表示"/);
  assert.match(html, /aria-label="次の記事を表示"/);
});
test('新着の実績を6件表示し、特定の日記で末尾の実績を置き換えない', () => {
  const results = Array.from({ length: 7 }, (_, i) => ({ id: `result-${i}`, title: `制作実績 ${i}`, summary: '実績概要', techStack: 'HTML,WordPress' }));
  const html = renderToStaticMarkup(createElement(load('app/_components/ResultsSlider/index.tsx').default, { results }));
  assert.match(html, /aria-label="制作実績と個人開発"/);
  assert.equal((html.match(/class="splide__slide"/g) || []).length, 6);
  assert.match(html, /href="\/result\/result-4\/?"/);
  assert.match(html, /href="\/result\/result-5\/?"/);
  assert.doesNotMatch(html, /href="\/diary\/iropon-release\/?"/);
  assert.doesNotMatch(html, /result-card__technologies/);
});
test('空のスライダーは操作ボタンも含めて非表示', () => {
  for (const [file, props] of [['DiarySlider', { blog: [] }], ['ResultsSlider', { results: [] }]]) {
    assert.equal(renderToStaticMarkup(createElement(load(`app/_components/${file}/index.tsx`).default, props)), '');
  }
});

test('個人開発がない場合は実績6件を表示する', () => {
  const results = Array.from({ length: 7 }, (_, i) => ({ id: `result-${i}`, title: `制作実績 ${i}`, summary: '実績概要' }));
  const html = renderToStaticMarkup(createElement(load('app/_components/ResultsSlider/index.tsx').default, { results }));
  assert.equal((html.match(/class="splide__slide"/g) || []).length, 6);
  assert.match(html, /href="\/result\/result-5\/?"/);
  assert.doesNotMatch(html, /href="\/result\/result-6\/?"/);
});
