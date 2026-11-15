import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const files = ['styles/pages/top.scss', 'styles/pages/result.scss', 'styles/pages/skill.scss', 'styles/object/component/_link.scss', 'styles/object/utility/_text.scss', 'styles/object/project/_form.scss'];
test('text link underlines explicitly use one CSS pixel including focus states', () => {
 for (const file of files) {
  const css=read(file);
  for (const match of css.matchAll(/text-decoration-line: underline;([\s\S]*?)(?=\}|text-decoration-line)/g)) assert.match(match[1], /text-decoration-thickness: 1px;/, file);
  for (const match of css.matchAll(/text-decoration-thickness:([^;]+);/g)) assert.equal(match[1].trim(), '1px', file);
 }
});
test('visible keyboard focus and 200ms disappearing underline are preserved',()=>{
 const css=read('styles/object/component/_link.scss');
 assert.match(css, /outline: 3px solid #69300b/);
 assert.match(css, /text-decoration-color 0\.2s ease/);
 assert.match(css, /text-decoration-color: transparent/);
 assert.match(read('styles/foundation/_base.scss'), /:hover:not\(:focus-visible\)/);
});
test('navigation marker stays a separate one pixel decoration',()=>{
 for(const path of ['styles/layout/_l-header.scss','styles/layout/_l-footer.scss']) assert.match(read(path), /height: 1px;/);
});
