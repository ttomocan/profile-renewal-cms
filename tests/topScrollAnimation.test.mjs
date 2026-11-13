import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const home = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
const work = readFileSync(new URL('../app/_components/WordPressWork/index.tsx', import.meta.url), 'utf8');

test('自主運営実績は画像群と本文群だけを既存フェードアップ対象にする', () => {
  assert.match(work, /className=\{`\$\{styles\.screens\} fadeUpTrigger`\}/);
  assert.match(work, /className=\{`\$\{styles\.body\} fadeUpTrigger`\}/);
  assert.equal((work.match(/fadeUpTrigger/g) || []).length, 2);
  assert.match(work, /<div className=\{styles\.card\}>/);
});

test('実績資格の注記もフェードアップ対象にする', () => {
  assert.match(home, /className="p-top-facts__note fadeUpTrigger"/);
});

test('動きを減らす設定では新しい対象も初期状態から表示する', () => {
  const base = readFileSync(new URL('../styles/foundation/_base.scss', import.meta.url), 'utf8');
  assert.match(base, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(base, /\[class\$='Trigger'\],[\s\S]*?opacity: 1 !important;[\s\S]*?transform: none !important;/);
});
