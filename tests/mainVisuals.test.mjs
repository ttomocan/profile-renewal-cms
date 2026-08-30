import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import * as sass from 'sass';

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
