import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import * as sass from 'sass';
import postcss from 'postcss';
import ts from 'typescript';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import { renderToStaticMarkup } from 'react-dom/server';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const compile = (relativePath) =>
  sass.compile(path.join(projectRoot, relativePath), { style: 'expanded' }).css;

const readSource = (relativePath) => readFileSync(path.join(projectRoot, relativePath), 'utf8');

test('下層メインビジュアルはX字マスクではなく静的グラデーションで文字を読みやすくする', () => {
  const css = compile('styles/layout/_l-pagetitle.scss');

  assert.match(css, /\.pagetitle::before\s*\{[^}]*linear-gradient/s);
  assert.doesNotMatch(css, /animation-name:\s*hero-(?:before|after)/);
  assert.doesNotMatch(css, /rotate:\s*-?45deg/);
});

test('About、Result、Contactは写真に依存しないページ固有のグラフィックを持つ', () => {
  const css = compile('styles/layout/_l-pagetitle.scss');
  const component = readSource('app/_components/PageTitle/index.tsx');

  for (const page of ['about', 'result', 'contact']) {
    assert.match(css, new RegExp(`\\.pagetitle--${page} \\.pagetitle__graphic`));
    assert.match(component, new RegExp(`page === ['"]${page}['"]|['"]${page}['"],?`));
  }

  assert.match(component, /<PageGraphic page=\{graphicPage\}/);
});

test('トップの背景画像には常時動く装飾やぼかしを重ねない', () => {
  const css = compile('styles/pages/top.scss');
  const page = readSource('app/page.tsx');

  assert.doesNotMatch(css, /dots-fade|pulse-glow|slow-zoom/);
  assert.doesNotMatch(css, /\.p-top-hero__image::after\s*\{[^}]*backdrop-filter:\s*blur/s);
  assert.doesNotMatch(page, /BubblyBackground/);
});

// Execute the real server component, isolating only CMS I/O and Next's build-time font import.
// Below-the-fold components are not rendered by this KV test.
const require = createRequire(import.meta.url);
async function loadHome() {
  const componentModule = { exports: {} };
  const code = ts.transpileModule(readSource('app/page.tsx'), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  const localRequire = (id) => {
    if (id.endsWith('.scss')) return {};
    if (id === '@/app/_libs/microcms') {
      const empty = async () => ({ contents: [], totalCount: 0, offset: 0, limit: 6 });
      return { getBlogList: empty, getResults: empty };
    }
    if (id === '@/app/_constants') return { TOP_DIARY_LIMIT: 6 };
    if (id === '@/app/fonts') return { caveatBrush: { variable: 'test-caveat' } };
    if (id.startsWith('@/app/_components/')) return () => { throw new Error('Only the KV should be rendered'); };
    return require(id);
  };
  runInNewContext(code, { module: componentModule, exports: componentModule.exports, require: localRequire });
  return componentModule.exports.default();
}

const findElement = (node, predicate) => {
  if (!node || typeof node !== 'object') return undefined;
  if (predicate(node)) return node;
  const children = [node.props?.children].flat();
  return children.map((child) => findElement(child, predicate)).find(Boolean);
};
async function renderHero() {
  return renderToStaticMarkup(findElement(await loadHome(), (node) => node.props?.className?.split(' ').includes('p-top-hero')));
}

test('メイン領域からKVの見出しと主要ナビゲーションに到達できる', async () => {
  const main = findElement(await loadHome(), (node) => node.type === 'main');
  assert.ok(findElement(main, (node) => node.type === 'h1'), 'main contains the page heading');
  const nav = findElement(main, (node) => node.type === 'nav' && node.props['aria-label'] === '主要ページ');
  assert.ok(nav, 'primary links are exposed as navigation');
  assert.equal(main.props.id, 'main');
  assert.equal(main.props.tabIndex, -1, 'skip link can move focus to main');
});

const heroCss = postcss.parse(compile('styles/pages/top.scss'));
const commonCss = postcss.parse(compile('styles/object/component/_button.scss'));
const declarations = (root, selector, media = null) => {
  const values = {};
  root.walkRules((rule) => {
    if (!rule.selectors.includes(selector)) return;
    const parentMedia = rule.parent.type === 'atrule' ? rule.parent.params : null;
    if (parentMedia === media) rule.walkDecls((decl) => { values[decl.prop] = decl.value; });
  });
  return values;
};
const luminance = (hex) => {
  const channels = hex.replace('#', '').match(/../g).map((c) => parseInt(c, 16) / 255)
    .map((c) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};

test('KVは専門性と実績を先に伝え、実績とプロフィールの2導線を維持する', async () => {
  const html = await renderHero();
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.match(html, /p-top-hero__identity[\s\S]*ともきゃんの似顔絵[\s\S]*TOMOCAN/);
  assert.match(html, /<h1[^>]*>設計・実装・改善まで担うWebエンジニア<\/h1>[\s\S]*<strong>10年以上<\/strong>[\s\S]*<strong>200サイト以上<\/strong>/);
  assert.match(html, /WordPress \/ フロントエンド実装 \/ UI改善 \/ SEO/);
  assert.deepEqual([...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((m) => m[1].replace(/\/$/, '')), ['/result', '/about']);
  assert.equal((html.match(/class="c-button__link"/g) ?? []).length, 1);
  assert.match(html, /class="p-top-hero__profile-link"/);
  assert.doesNotMatch(html, /Blogger|aria-hidden="true">TOMOCAN/);
});

test('KVの画像はPCとSPで切り替え、背景を優先読み込みする', async () => {
  const html = await renderHero();
  assert.match(html, /<source[^>]*img_hero_sp[^>]*media="\(max-width: 767px\)"/);
  assert.match(html, /<source[^>]*img_hero\.webp[^>]*media="\(min-width: 768px\)"/);
  assert.match(html, /<img(?=[^>]*fetchPriority="high")(?=[^>]*loading="eager")[^>]*>/);
});

test('KV主要CTAは通常・hoverとも白文字4.5:1以上を確保する', () => {
  for (const [selector, color] of [
    ['.p-top-hero__actions .c-button__link', '#b54708'],
    ['.p-top-hero__actions .c-button__link:hover', '#8f3500'],
  ]) {
    const style = declarations(heroCss, selector);
    assert.equal(style['background-color'], color);
    assert.ok(1.05 / (luminance(style['background-color']) + 0.05) >= 4.5);
    assert.equal(style.color, '#ffffff');
  }
  assert.ok(Number.parseFloat(declarations(heroCss, '.p-top-hero__actions .c-button__link')['min-height']) >= 54);
  assert.ok(Number.parseFloat(declarations(heroCss, '.p-top-hero__profile-link')['min-height']) >= 44);
  assert.equal(declarations(heroCss, '.p-top-hero__actions a:focus-visible').outline, '3px solid #ffffff');
});

test('共通ボタンは通常・hover・focusすべてで文字コントラスト4.5:1以上を確保する', () => {
  for (const state of ['', ':hover', ':focus']) {
    const style = { ...declarations(commonCss, '.c-button__link'), ...declarations(commonCss, `.c-button__link${state}`) };
    const values = [luminance(style.color), luminance(style['background-color'])].sort((a, b) => b - a);
    assert.ok((values[0] + 0.05) / (values[1] + 0.05) >= 4.5, `button ${state || 'default'}`);
  }
});

test('短いSPでは余白を縮めても本文サイズと自然な縦スクロールを維持する', () => {
  const sp = declarations(heroCss, '.p-top-hero', '(max-width: 767px)');
  const compact = declarations(heroCss, '.p-top-hero', '(max-width: 767px) and (max-height: 700px)');
  assert.ok(Number.parseFloat(compact['padding-top']) < Number.parseFloat(sp['padding-top']));
  assert.ok(Number.parseFloat(declarations(heroCss, '.p-top-hero__about-text', '(max-width: 767px)')['font-size']) >= 16);
  assert.equal(declarations(heroCss, '.p-top-hero').height, undefined);
  assert.equal(declarations(heroCss, '.p-top-hero').overflow, undefined);
});

test('KVのグラデーションは白い写真の上でも白文字4.5:1以上を確保する', () => {
  for (const media of [null, '(max-width: 767px)']) {
    const gradient = declarations(heroCss, '.p-top-hero__image::before', media).background;
    const stops = [...gradient.matchAll(/rgba\(24, 17, 13, ([\d.]+)\)/g)];
    assert.ok(stops.length >= 2);
    for (const [, alpha] of stops) {
      const background = [24, 17, 13].map((channel) =>
        Math.round(channel * Number(alpha) + 255 * (1 - Number(alpha))).toString(16).padStart(2, '0')).join('');
      assert.ok(1.05 / (luminance(background) + 0.05) >= 4.5, `overlay alpha ${alpha}`);
    }
  }
});

test('KVコンテンツはアニメーションや遅延・透明化なしで初期表示する', () => {
  heroCss.walkRules((rule) => {
    if (!rule.selector.includes('.p-top-hero')) return;
    rule.walkDecls((decl) => {
      assert.ok(!decl.prop.startsWith('animation'), `${rule.selector}: ${decl.prop}`);
      assert.ok(!(decl.prop === 'opacity' && Number(decl.value) < 1));
      assert.notEqual(decl.prop, 'backdrop-filter');
    });
  });
});
