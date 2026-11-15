import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const source=readFileSync('lib/handwritingScript.ts','utf8');
const script=source.match(/`([\s\S]*)`;/)[1];
function setup({reduced=false,ready='loading'}={}){
 const root={dataset:{}};const events={};const timers=[];const frames=[];
 runInNewContext(script,{document:{currentScript:{parentElement:root},readyState:ready},matchMedia:()=>({matches:reduced}),window:{addEventListener:(name,fn)=>events[name]=fn},setTimeout:(fn,ms)=>{timers.push({fn,ms});return timers.length;},clearTimeout:()=>{},requestAnimationFrame:fn=>frames.push(fn)});
 return {root,events,timers,frames};
}
test('waits for window load before drawing only the name',()=>{const s=setup();assert.equal(s.root.dataset.handwriting,'pending');s.events.load();assert.equal(s.root.dataset.handwriting,'drawing');s.timers.find(t=>t.ms===2600).fn();assert.equal(s.root.dataset.handwriting,undefined);});
test('loaded page starts on next frame',()=>{const s=setup({ready:'complete'});assert.equal(s.frames.length,1);s.frames[0]();assert.equal(s.root.dataset.handwriting,'drawing');});
test('reduced motion keeps final lettering visible',()=>{const s=setup({reduced:true});assert.deepEqual(s.root.dataset,{});assert.equal(s.timers.length,0);});
test('failed load reveals lettering after five seconds',()=>{const s=setup();s.timers.find(t=>t.ms===5000).fn();assert.equal(s.root.dataset.handwriting,undefined);});
test('late load does not hide lettering again after fallback',()=>{const s=setup();s.timers.find(t=>t.ms===5000).fn();s.events.load();assert.equal(s.root.dataset.handwriting,undefined);});
test('SVG is decorative and text alternative remains accessible',()=>{const s=readFileSync('app/_components/HandwrittenName.tsx','utf8');assert.match(s,/u-visually-hidden">TOMOCAN/);assert.match(s,/aria-hidden="true" focusable="false"/);assert.match(s,/maskUnits="userSpaceOnUse"/);});
test('no JavaScript defaults to complete lettering; no whole-hero intro',()=>{const css=readFileSync('styles/pages/top.scss','utf8');assert.match(css,/:not\(\[data-handwriting\]\).*mask: none/);assert.match(css,/prefers-reduced-motion/);assert.doesNotMatch(css,/hero-intro|100dvh/);});
