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
  runInNewContext(code, { module: componentModule, exports: componentModule.exports, require });
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
  const items = [{ id: 'other' }, { id: 'career-media-01' }, { id: 'corporate-handball-team-01' }];
  const selected = selectFeaturedResults(items);
  assert.deepEqual(Array.from(selected, item => item.id), ['corporate-handball-team-01', 'career-media-01']);
  assert.deepEqual(items.map(item => item.id), ['other', 'career-media-01', 'corporate-handball-team-01']);
  assert.equal(selectFeaturedResults([]).length, 0);
  assert.deepEqual(Array.from(selectFeaturedResults([{ id: 'new' }]), item => item.id), ['new']);
});
