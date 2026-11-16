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

test('wave remains still on reduced-motion resize and responds to preference changes', () => {
  let effect, resize, preferenceChange, frames = 0, cancellations = 0;
  const timers = [];
  const context = new Proxy({}, { get: () => () => {} });
  const canvas = { style: {}, getContext: () => context, getBoundingClientRect: () => ({ width: 320, height: 100 }) };
  const query = { matches: true, addEventListener: (_, fn) => { preferenceChange = fn; }, removeEventListener: () => {} };
  const Component = load('app/_components/WaveAnimation/index.tsx', {
    react: { ...React, useRef: initial => ({ current: initial === null ? canvas : initial }), useCallback: fn => fn, useMemo: fn => fn(), useEffect: fn => { effect = fn; } },
  }, {
    window: { devicePixelRatio: 1, matchMedia: () => query, ResizeObserver: true },
    ResizeObserver: class { constructor(fn) { resize = fn; } observe() {} disconnect() {} },
    requestAnimationFrame: () => ++frames, cancelAnimationFrame: () => { cancellations++; },
    setTimeout: (fn, delay) => { if (delay <= 16) fn(); else timers.push({ fn, delay }); return 1; }, clearTimeout: () => {},
  });
  Component({});
  const cleanup = effect();
  assert.equal(frames, 0);
  resize();
  assert.equal(frames, 0, 'resizing must not restart animation');
  assert.equal(typeof preferenceChange, 'function');
  query.matches = false; preferenceChange();
  assert.equal(frames, 1);
  query.matches = true; preferenceChange();
  assert.equal(cancellations, 1);
  resize();
  assert.equal(frames, 1);
  assert.equal(timers.length, 1, 'one animation budget per mount, not per resize');
  assert.ok(timers[0].delay <= 4500);
  timers[0].fn();
  query.matches = false; preferenceChange();
  resize();
  assert.equal(frames, 1, 'expired animation cannot restart after resize or settings change');
  cleanup();
});
