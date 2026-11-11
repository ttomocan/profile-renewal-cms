import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('自主運営実績の画像枠はドメイン名バーの上余白を持たず画像全体を表示する', () => {
  const css = readFileSync(new URL('../app/_components/WordPressWork/index.module.css', import.meta.url), 'utf8');
  const bar = css.match(/\.browserBar\s*\{([^}]*)\}/)?.[1];
  assert.ok(bar);
  assert.match(bar, /margin-top:\s*0\s*;/);
  assert.match(css, /\.viewport\s*\{[^}]*aspect-ratio:\s*1150\s*\/\s*738\s*;/);
  assert.match(css, /\.viewport img\s*\{[^}]*object-fit:\s*contain\s*;/);
});
