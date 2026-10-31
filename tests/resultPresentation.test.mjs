import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const require = createRequire(import.meta.url);
function load(relativePath) {
  const componentModule = { exports: {} };
  const code = ts.transpileModule(readFileSync(new URL(relativePath, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  const localRequire = id => id === '@/lib/contentOrder' ? load('../lib/contentOrder.ts') : require(id);
  runInNewContext(code, { module: componentModule, exports: componentModule.exports, require: localRequire });
  return componentModule.exports;
}

test('使用技術と制作ツールを分け、空欄と旧データでも表示できる', () => {
  const { groupProjectTechnologies } = load('../lib/resultPresentation.ts');
  const grouped = groupProjectTechnologies('HTML, PHP, WordPress, VSCode, Photoshop, Figma');
  assert.deepEqual(Array.from(grouped.technologies), ['HTML', 'PHP', 'WordPress']);
  assert.deepEqual(Array.from(grouped.tools), ['VSCode', 'Photoshop', 'Figma']);
  assert.equal(groupProjectTechnologies().technologies.length, 0);
  assert.equal(groupProjectTechnologies('  ').tools.length, 0);
});

test('代表枠は存在する実績だけを選び、元の一覧を変更しない', () => {
  const { selectFeaturedResults } = load('../lib/resultPresentation.ts');
  const items = [{ id: 'other', publishedAt: '2026-02-01' }, { id: 'career-media-01', publishedAt: '2025-01-01' }, { id: 'corporate-handball-team-01', publishedAt: '2025-02-01' }];
  const selected = selectFeaturedResults(items);
  assert.deepEqual(Array.from(selected, item => item.id), ['other', 'corporate-handball-team-01', 'career-media-01']);
  assert.deepEqual(items.map(item => item.id), ['other', 'career-media-01', 'corporate-handball-team-01']);
  assert.equal(selectFeaturedResults([]).length, 0);
  assert.deepEqual(Array.from(selectFeaturedResults([{ id: 'new' }]), item => item.id), ['new']);
});

test('代表枠は固定案件を優先せず、公開日の新しい6件を重複なく選ぶ', () => {
  const { selectFeaturedResults } = load('../lib/resultPresentation.ts');
  const items = ['corporate-handball-team-01', 'extra-1', 'extra-2', 'extra-3', 'extra-4', 'extra-5', 'extra-6', 'extra-6'].map((id, i) => ({ id, publishedAt: `2026-01-${String(i + 1).padStart(2, '0')}` }));
  assert.deepEqual(Array.from(selectFeaturedResults(items), item => item.id), ['extra-6', 'extra-5', 'extra-4', 'extra-3', 'extra-2', 'extra-1']);
});
