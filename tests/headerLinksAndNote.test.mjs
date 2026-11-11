import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import * as sass from 'sass';
import postcss from 'postcss';
import { createDiaryHarness } from './helpers/diaryPageHarness.mjs';

test('ヘッダーからブログ2リンクだけを削除し、主要ナビとSNSを維持する', async () => {
  const harness = createDiaryHarness({});
  const MenuNav = harness.load('app/_components/MenuNav/index.tsx').default;
  const html = await harness.render(createElement(MenuNav));
  const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(([, href]) => href);
  assert.deepEqual(links, ['/', '/about', '/skill', '/result', '/diary', '/contact',
    'https://note.com/tomoweb_lab', 'https://x.com/t_tomocan', 'https://coconala.com/users/1531202']);
  assert.doesNotMatch(html, /l-header__blog/);

  const WordPressWork = harness.load('app/_components/WordPressWork/index.tsx').default;
  const work = await harness.render(createElement(WordPressWork));
  for (const host of ['www.newagevoice.com', 'www.blogdesign-mania.com']) {
    assert.ok(work.includes(`href="https://${host}/"`));
  }
});

test('参画件数の注記はPC幅のみ中央寄せにする', () => {
  const css = postcss.parse(sass.compile('styles/pages/top.scss').css);
  const alignments = [];
  css.walkRules('.p-top-facts__note', (rule) => {
    rule.walkDecls('text-align', (decl) => {
      alignments.push({ value: decl.value, media: rule.parent.type === 'atrule' ? rule.parent.params : null });
    });
  });
  assert.deepEqual(alignments, [{ value: 'center', media: '(min-width: 1041px)' }]);
});

test('PCヘッダーはブログ行削除後も主要ナビとSNSを中央に揃える', () => {
  const css = postcss.parse(sass.compile('styles/layout/_l-header.scss').css);
  const values = {};
  css.walkRules((rule) => {
    if (rule.parent.type !== 'atrule' || rule.parent.params !== '(min-width: 1041px)') return;
    if (!['.l-header__link', '.l-header__sns'].includes(rule.selector)) return;
    rule.walkDecls((decl) => { values[`${rule.selector}:${decl.prop}`] = decl.value; });
  });
  assert.equal(values['.l-header__link:align-items'], 'center');
  assert.notEqual(values['.l-header__sns:grid-row'], '1 / 3');
});
