import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('自主運営のWordPress実績カードは他のカードと同じ白背景を使う', () => {
  const css = readFileSync(new URL('../app/_components/WordPressWork/index.module.css', import.meta.url), 'utf8');
  const card = css.match(/\.card\s*\{([^}]*)\}/)?.[1];
  assert.ok(card);
  assert.match(card, /background:\s*#fff(?:fff)?\s*;/);
});
