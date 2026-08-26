import assert from 'node:assert/strict';
import test from 'node:test';
import { compile } from 'sass';

const css = compile('styles/common/style.scss', { style: 'expanded' }).css;

test('semantic token regressions must not remove the shared :root color, spacing, radius, and content-width contract', () => {
  for (const declaration of [
    '--brand-accent: #f36b0a;',
    '--brand-strong: #b54708;',
    '--brand-strong-hover: #8f3500;',
    '--text: #282828;',
    '--text-secondary: #666666;',
    '--base: #fcf6f1;',
    '--subtle: #f5ede7;',
    '--surface: #ffffff;',
    '--border: #d8cec7;',
    '--focus: #0066cc;',
    '--error: #b3261e;',
    '--space-4: 4px;',
    '--space-8: 8px;',
    '--space-12: 12px;',
    '--space-16: 16px;',
    '--space-24: 24px;',
    '--space-32: 32px;',
    '--space-48: 48px;',
    '--space-64: 64px;',
    '--space-80: 80px;',
    '--space-96: 96px;',
    '--radius-small: 6px;',
    '--radius-standard: 10px;',
    '--radius-large: 16px;',
    '--content-width: 1120px;',
    '--reading-width: 760px;',
  ]) {
    assert.ok(css.includes(declaration), `missing ${declaration}`);
  }
});

test('foundation regressions must not change the accessible 16px body, blue focus ring, or reduced-motion fallback', () => {
  assert.match(css, /body \{[\s\S]*background-color: #fcf6f1;[\s\S]*color: #282828;[\s\S]*font-size: 16px;[\s\S]*line-height: 1\.8;/);
  assert.match(css, /:where\(a, button, input, textarea, select, summary\):focus-visible \{[\s\S]*outline: 3px solid #0066cc;[\s\S]*outline-offset: 3px;/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*scroll-behavior: auto;[\s\S]*animation-duration: 0\.01ms !important;[\s\S]*transition-duration: 0\.01ms !important;[\s\S]*\[class\$=Trigger\][\s\S]*opacity: 1 !important;[\s\S]*transform: none !important;/);
});

test('layout regressions must not change responsive container gutters or section rhythm tokens', () => {
  assert.match(css, /\.inner \{[\s\S]*max-width: calc\(1120px \+ 48px\);[\s\S]*padding-left: 24px;[\s\S]*padding-right: 24px;/);
  assert.match(css, /\.inner-s \{[\s\S]*max-width: calc\(760px \+ 48px\);/);
  assert.match(css, /section:not\(:is\(\.pagetitle, :last-of-type\)\) \{[\s\S]*padding-bottom: 96px;/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.inner \{[\s\S]*max-width: calc\(1120px \+ 32px\);[\s\S]*padding-left: 16px;[\s\S]*padding-right: 16px;[\s\S]*\.inner-s \{[\s\S]*max-width: calc\(760px \+ 32px\);[\s\S]*section:not\(:is\(\.pagetitle, :last-of-type\)\) \{[\s\S]*padding-bottom: 64px;/);
});
