import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as sass from 'sass';
import postcss from 'postcss';
function style(file, selector) {
  const values = {};
  postcss.parse(sass.compile(file).css).walkRules(rule => {
    if (rule.selectors.includes(selector)) rule.walkDecls(d => { values[d.prop] = d.value; });
  });
  return values;
}
test('contact input focus is a flush 2px outline', () => {
  const css = style('styles/object/project/_form.scss', '.p-form :is(input[type=text], input[type=email], textarea):focus');
  assert.equal(css.outline, '2px solid #b54708');
  assert.equal(css['outline-offset'], '0');
});
test('validation errors use readable dark red', () => {
  assert.equal(style('styles/object/project/_form.scss', '.p-form__error').color, '#a32116');
});
test('search and category have strong boundaries and flush 2px focus', () => {
  const shared = 'app/_components/DiaryFilterControls.module.css';
  assert.equal(style(shared, '.field').background, '#fff');
  assert.equal(style(shared, '.field:focus-visible').outline, '2px solid #b54708');
  assert.equal(style(shared, '.field:focus-visible')['outline-offset'], '0');
  assert.equal(style(shared, '.field')['min-width'], '0');
  assert.equal(style(shared, '.submitButton:focus-visible').outline, '3px solid #69300b');
});
