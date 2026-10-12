import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';
import * as sass from 'sass';
import postcss from 'postcss';

const require = createRequire(import.meta.url);
function load(file) {
  const componentModule = { exports: {} };
  const code = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  runInNewContext(code, { module: componentModule, exports: componentModule.exports, require });
  return componentModule.exports;
}
function style(file, selector) {
  const values = {};
  postcss.parse(sass.compile(file).css).walkRules(rule => {
    if (rule.selectors.includes(selector)) rule.walkDecls(decl => { values[decl.prop] = decl.value; });
  });
  return values;
}
const luminance = hex => hex.match(/[a-f0-9]{2}/gi).map(c => parseInt(c, 16) / 255)
  .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
const contrast = (a, b) => {
  const l = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l[0] + 0.05) / (l[1] + 0.05);
};
test('日記の目次対象見出しはネイティブアンカーでフォーカスでき、リンクと見出し内容を保つ', () => {
  const { addHeadingIds } = load('lib/tableOfContents.ts');
  const output = addHeadingIds('<h2>見出し1</h2><p><a href="/diary/">リンク</a></p><h3>見出し2</h3>');
  assert.match(output.content, /<h2[^>]*tabindex="-1"[^>]*>見出し1<\/h2>/);
  assert.match(output.content, /<h3[^>]*tabindex="-1"[^>]*>見出し2<\/h3>/);
  assert.equal(output.items.length, 2);
  assert.match(output.content, /href="\/diary\/"/);
});
test('通常サイズのcurrentナビ文字はサイト背景に対して4.5:1以上', () => {
  const values = style('styles/layout/_l-header.scss', '.l-header .l-navigation__item a:is(:hover, .current)');
  assert.ok(contrast(values.color, '#f2edea') >= 4.5, `current ${values.color}`);
});
test('フォーム必須ラベルの白文字は背景に対して4.5:1以上', () => {
  const values = style('styles/object/project/_form.scss', '.p-form__required');
  assert.ok(contrast(values.color, values.background) >= 4.5);
});
test('問い合わせ種別はlegendで名前が付いたネイティブfieldsetを使い無名の追加グループを作らない', () => {
  const componentModule = { exports: {} };
  const code = ts.transpileModule(readFileSync('app/_components/ContactForm/index.tsx', 'utf8'), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  const localRequire = id => id === '@/app/_actions/contact'
    ? { createContactData: async () => { throw new Error('SSR must not submit the form'); } } : require(id);
  runInNewContext(code, { module: componentModule, exports: componentModule.exports, require: localRequire });
  const html = renderToStaticMarkup(createElement(componentModule.exports.default));
  assert.match(html, /<fieldset[^>]*>[\s\S]*<legend[^>]*>[\s\S]*お問い合わせ項目/);
  assert.equal((html.match(/type="radio"/g) || []).length, 5);
  assert.doesNotMatch(html, /role="radiogroup"/);
});

test('日記と実績の一覧カードは親のクリッピング内に高コントラストのfocus枠を表示する', () => {
  for (const [file, selector] of [
    ['app/_components/DiaryList/index.module.css', '.link:focus-visible'],
    ['styles/pages/result.scss', '.result-card__link:focus-visible'],
  ]) {
    const values = style(file, selector);
    assert.ok(Number.parseFloat(values['outline-offset']) < 0, `${selector}: outline must be inside the card`);
    assert.ok(Number.parseFloat(values.outline) >= 3);
    assert.ok(contrast(values.outline.match(/#[a-f0-9]{6}/i)[0], '#ffffff') >= 3);
  }
});
test('フッターはブランド背景を保持し、通常文字4.5:1とfocus枠3:1以上を確保する', () => {
  const file = 'styles/layout/_l-footer.scss';
  const background = style(file, '.l-footer')['background-color'];
  assert.equal(background, '#f36b0a');
  for (const selector of ['.l-footer *', '.l-footer .l-navigation a']) {
    assert.ok(contrast(style(file, selector).color, background) >= 4.5);
  }
  const outline = style(file, '.l-footer :is(a, button):focus-visible').outline;
  assert.ok(contrast(outline.match(/#[a-f0-9]{6}/i)[0], background) >= 3);
});
test('日記検索ボタンは通常とhoverで文字4.5:1以上', () => {
  const file = 'app/_components/SearchField/index.module.css';
  const normal = style(file, '.submitButton');
  for (const values of [normal, { ...normal, ...style(file, '.submitButton:hover') }]) {
    assert.ok(contrast(values.background, values.color === 'white' ? '#ffffff' : values.color) >= 4.5);
  }
});
test('記事本文リンクは通常とhoverで下線を保ち、合成後の文字4.5:1以上', () => {
  const file = 'app/_components/Article/index.module.css';
  const normal = style(file, '.content a');
  assert.equal(normal['text-decoration'], 'underline');
  for (const values of [normal, { ...normal, ...style(file, '.content a:hover') }]) {
    const opacity = Number(values.opacity ?? 1);
    const effective = values.color.match(/[a-f0-9]{2}/gi).map((c, i) =>
      Math.round(parseInt(c, 16) * opacity + [242, 237, 234][i] * (1 - opacity)).toString(16).padStart(2, '0')).join('');
    assert.ok(contrast(effective, '#f2edea') >= 4.5);
  }
});
