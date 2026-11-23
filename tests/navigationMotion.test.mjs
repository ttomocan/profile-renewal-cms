import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const require = createRequire(import.meta.url);
function load(file, mocks = {}, globals = {}) {
  const componentModule = { exports: {} };
  const code = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  runInNewContext(code, { module: componentModule, exports: componentModule.exports, require: id => mocks[id] ?? require(id), ...globals });
  return componentModule.exports.default;
}

test('header and footer expose the current section without marking other links current', () => {
  for (const file of ['MenuNav', 'Footer']) {
    const Component = load(`app/_components/${file}/index.tsx`, {
      'next/navigation': { usePathname: () => '/diary/example/' },
      'next/link': ({ children, ...props }) => React.createElement('a', props, children),
      'next/image': props => React.createElement('img', props),
      '@/app/_components/WaveAnimation': () => null,
    });
    const html = renderToStaticMarkup(React.createElement(Component));
    assert.equal((html.match(/aria-current="page"/g) || []).length, 1);
    assert.match(html, /<a[^>]*href="\/diary\/"[^>]*aria-current="page"/);
  }
});

test('the shared footer keeps its wave identity until the pathname changes', () => {
  let pathname = '/skill/';
  const Footer = load('app/_components/Footer/index.tsx', {
    'next/navigation': { usePathname: () => pathname },
    '@/app/_components/WaveAnimation': () => null,
  });
  const waveKey = () => Footer().props.children[0].props.children.key;
  assert.equal(waveKey(), '/skill/');
  assert.equal(waveKey(), '/skill/', 'normal renders on the same path must not reset motion');
  pathname = '/about/';
  assert.equal(waveKey(), '/about/', 'client-side navigation starts a new per-page budget');
});

test('back-to-top transfers keyboard focus before its button becomes hidden', () => {
  const calls = [];
  const Component = load('app/_components/PageTop/index.tsx', {
    react: { ...React, useRef: () => ({ current: null }), useEffect: () => {} },
  }, {
    window: { matchMedia: () => ({ matches: true }), scrollTo: options => calls.push(['scroll', options.top]) },
    document: { getElementById: id => id === 'main' ? { focus: () => calls.push(['focus']) } : null },
  });
  Component().props.onClick();
  assert.deepEqual(calls, [['focus'], ['scroll', 0]]);
});

function mountWave({ reducedMotion = false } = {}) {
  let effect, resize, preferenceChange, intersect, threshold, visibilityChange, frames = 0, cancellations = 0, draws = 0;
  let now = 0, currentWidth = 320, id = 0;
  const timers = new Map();
  const context = new Proxy({}, { get: (_, key) => key === 'clearRect' ? () => { draws++; } : () => {} });
  const canvas = { style: {}, getContext: () => context, getBoundingClientRect: () => ({ width: currentWidth, height: 100 }) };
  const query = { matches: reducedMotion, addEventListener: (_, fn) => { preferenceChange = fn; }, removeEventListener: () => {} };
  const document = { visibilityState: 'visible', addEventListener: (_, fn) => { visibilityChange = fn; }, removeEventListener: () => {} };
  class IntersectionObserver { constructor(fn, options) { intersect = fn; threshold = options?.threshold; } observe() {} disconnect() {} }
  class ResizeObserver { constructor(fn) { resize = fn; } observe() {} disconnect() {} }
  const Component = load('app/_components/WaveAnimation/index.tsx', {
    react: { ...React, useRef: initial => ({ current: initial === null ? canvas : initial }), useCallback: fn => fn, useMemo: fn => fn(), useEffect: fn => { effect = fn; } },
  }, {
    window: { devicePixelRatio: 1, matchMedia: () => query, IntersectionObserver, ResizeObserver },
    IntersectionObserver, ResizeObserver, document, performance: { now: () => now },
    Date: { now: () => now }, requestAnimationFrame: () => ++frames, cancelAnimationFrame: () => { cancellations++; },
    setTimeout: (fn, delay) => { timers.set(++id, { fn, at: now + delay }); return id; },
    clearTimeout: id => timers.delete(id),
  });
  Component({});
  const cleanup = effect();
  const advance = ms => {
    const end = now + ms;
    while (timers.size) {
      const [key, next] = [...timers].sort(([, a], [, b]) => a.at - b.at)[0];
      if (next.at > end) break;
      now = next.at;
      timers.delete(key);
      next.fn();
    }
    now = end;
  };
  return {
    cleanup, advance, canvas, frames: () => frames, draws: () => draws, cancellations: () => cancellations,
    threshold,
    enter: (intersectionRatio = 1) => intersect([{ target: canvas, isIntersecting: true, intersectionRatio }]),
    leave: () => intersect([{ target: canvas, isIntersecting: false, intersectionRatio: 0 }]),
    resize: width => { currentWidth = width; resize(); advance(16); },
    reduce: matches => { query.matches = matches; preferenceChange(); },
    hide: hidden => { document.visibilityState = hidden ? 'hidden' : 'visible'; visibilityChange(); },
  };
}

test('the footer wave remains drawn but saves its animation budget until it is in view', () => {
  const wave = mountWave();
  assert.equal(wave.frames(), 0, 'offscreen mount must not start animation');
  assert.ok(wave.draws() > 0, 'static wave must still be painted');
  wave.advance(9000);
  wave.enter();
  assert.equal(wave.frames(), 1, 'arriving after the old deadline still starts the animation');
  wave.advance(1200);
  wave.leave();
  assert.equal(wave.cancellations(), 1);
  wave.advance(9000);
  wave.enter();
  assert.equal(wave.frames(), 2, 're-entering resumes the unused part of the budget');
  wave.advance(3299);
  assert.equal(wave.cancellations(), 1);
  wave.advance(1);
  assert.equal(wave.cancellations(), 2, 'total animation time must stay capped at 4500 ms');
  wave.leave(); wave.enter();
  assert.equal(wave.frames(), 2, 'do not replay once the budget has elapsed');
  wave.cleanup();
});

test('edge adjacency cannot spend the budget or suppress the next positive intersection', () => {
  const wave = mountWave();
  assert.equal(wave.threshold, 0.01, 'a positive threshold ensures entry after the zero-area edge');
  wave.enter(0);
  wave.enter(0.005);
  assert.equal(wave.frames(), 0);
  wave.advance(6000);
  wave.enter(0.01);
  assert.equal(wave.frames(), 1);
  wave.cleanup();
});

test('reduced motion, a hidden tab, and resizing do not restart or extend the wave', () => {
  const wave = mountWave({ reducedMotion: true });
  wave.enter();
  wave.resize(390);
  assert.equal(wave.frames(), 0);
  assert.equal(wave.canvas.width, 390, 'measure current rendered width when backing canvas updates');
  assert.equal(wave.canvas.style.width, undefined, 'do not pin the responsive CSS width in pixels');
  wave.reduce(false);
  assert.equal(wave.frames(), 1);
  wave.advance(1000);
  wave.hide(true);
  assert.equal(wave.cancellations(), 1);
  wave.advance(6000);
  wave.hide(false);
  assert.equal(wave.frames(), 2);
  wave.resize(420);
  assert.equal(wave.frames(), 2, 'resize redraws without replacing an active RAF');
  wave.advance(2000);
  wave.reduce(true);
  assert.equal(wave.cancellations(), 2);
  wave.advance(6000);
  wave.reduce(false);
  assert.equal(wave.frames(), 3);
  wave.advance(1484);
  assert.equal(wave.cancellations(), 3);
  wave.cleanup();
});
