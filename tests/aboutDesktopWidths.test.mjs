import assert from 'node:assert/strict';
import test from 'node:test';
import * as sass from 'sass';
import postcss from 'postcss';
import { createDiaryHarness } from './helpers/diaryPageHarness.mjs';

test('プロフィールの本文コンテナはPC幅だけ共通の広い幅にそろえる', async () => {
  const harness = createDiaryHarness({});
  const html = await harness.render(harness.load('app/about/page.tsx').default());
  const sections = [...html.matchAll(/<section class="([^"]+)"/g)].map(([, classes]) => classes);
  assert.equal(sections.length, 7);
  assert.ok(sections.every(classes => classes.split(' ').includes('inner')));
  assert.equal(sections.filter(classes => classes.split(' ').includes('inner-s')).length, 5);

  const about = postcss.parse(sass.compile('styles/pages/about.scss').css);
  const common = postcss.parse(sass.compile('styles/common/style.scss').css);
  const find = (tree, selector, prop) => {
    const matches = [];
    tree.walkRules(selector, rule => rule.walkDecls(prop, decl => {
      matches.push([decl.value, rule.parent.type === 'atrule' ? rule.parent.params : null]);
    }));
    return matches;
  };
  const wide = find(common, '.inner', 'max-width')[0][0];
  const narrow = find(common, '.inner.inner-s', 'max-width')[0][0];
  assert.notEqual(narrow, wide);
  assert.deepEqual(find(about, '.about main > section.inner.inner-s', 'max-width'), [[wide, '(min-width: 1041px)']]);
  const notes = [
    '.about .greeting__detail',
    '.about .about-section--compact > .about-section-copy',
    '.about .work-style[aria-labelledby=about-contact-heading] > .about-section-copy',
  ];
  let proseRuleFound = false;
  about.walkRules((rule) => {
    if (rule.parent.type !== 'atrule' || rule.parent.params !== '(min-width: 1041px)') return;
    if (!notes.every(s => rule.selectors.includes(s))) return;
    proseRuleFound = true;
    assert.equal(rule.nodes.find(d => d.prop === 'max-width')?.value, '640px');
    assert.equal(rule.nodes.find(d => d.prop === 'width')?.value, '100%');
  });
  assert.ok(proseRuleFound);
  assert.equal(find(about, '.about .profile__cont', 'max-width').length, 0);
});
