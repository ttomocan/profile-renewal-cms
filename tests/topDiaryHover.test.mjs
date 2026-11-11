import assert from 'node:assert/strict';
import test from 'node:test';
import * as sass from 'sass';
import postcss from 'postcss';

const declarations = (css, selector) => {
  const values = {};
  postcss.parse(css).walkRules(selector, (rule) => {
    rule.walkDecls((decl) => { values[decl.prop] = decl.value; });
  });
  return values;
};

test('トップの活動カードはホバーで上に移動せず、他のカードに影響しない', () => {
  const top = sass.compile('styles/pages/top.scss').css;
  const diary = sass.compile('app/_components/DiarySlider/style.scss').css;
  assert.equal(declarations(top, '.p-top-diary .diary-slider-wrapper .diary-card:hover').transform, 'none');
  assert.equal(declarations(top, '.p-top-results .result-card:hover').transform, 'translateY(-2px)');
  assert.equal(declarations(diary, '.diary-slider-wrapper .diary-card:hover').transform, 'translateY(-2px)');
  assert.ok(declarations(diary, '.diary-slider-wrapper .diary-card:hover')['box-shadow']);
  assert.equal(declarations(diary, '.diary-slider-wrapper .diary-card:hover .diary-card__image-img').transform, 'scale(1.08)');
  assert.equal(declarations(diary, '.diary-slider-wrapper .diary-card:hover .diary-card__overlay').opacity, '1');
});
