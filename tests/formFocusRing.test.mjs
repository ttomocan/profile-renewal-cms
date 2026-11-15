import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const css=readFileSync(new URL('../styles/object/project/_form.scss',import.meta.url),'utf8');
test('text inputs have a flush focus ring matching the primary button',()=>{
 assert.match(css,/border-color: #b54708;\s*outline: 3px solid #b54708;\s*outline-offset: 0;/);
 const button=readFileSync(new URL('../styles/object/component/_button.scss',import.meta.url),'utf8');
 assert.match(button,/@include btn\(#b54708,/);
});
test('button and radio focus indications are preserved',()=>{
 assert.match(css,/button:focus-visible\s*\{\s*outline: 3px solid #69300b;\s*outline-offset: 3px;/);
 assert.match(css,/input\[type='radio'\]:focus-visible \+ .checkbox-text::before/);
});
