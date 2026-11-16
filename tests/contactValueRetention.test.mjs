import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import React from 'react';

const require = createRequire(import.meta.url);
function formHarness() {
  let values;
  let actionState = { status: 'idle', message: '' };
  let effects = [];
  let lastDependencies;
  const refs = [];
  let refIndex = 0;
  const radioDom = [];
  const focused = [];
  const mocks = {
    react: {
      ...React,
      useActionState: () => [actionState, () => { throw new Error('Must not submit'); }],
      useState: initial => {
        values ??= initial;
        return [values, update => { values = typeof update === 'function' ? update(values) : update; }];
      },
      useRef: initial => {
        const index = refIndex++;
        refs[index] ??= { current: initial === null ? {
          querySelector: selector => ({ focus: () => focused.push(selector) }),
          querySelectorAll: () => radioDom,
          focus: () => focused.push('success'),
        } : initial };
        return refs[index];
      },
      useEffect: (effect, dependencies) => {
        if (!lastDependencies || dependencies.some((value, index) => value !== lastDependencies[index])) effects.push(effect);
        lastDependencies = dependencies;
      },
    },
    '@/app/_actions/contact': { createContactData: () => { throw new Error('Must not contact external service'); } },
    '@next/third-parties/google': { sendGAEvent: () => { throw new Error('Must not send analytics'); } },
  };
  const componentModule = { exports: {} };
  const code = ts.transpileModule(readFileSync('app/_components/ContactForm/index.tsx', 'utf8'), {
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  runInNewContext(code, { module: componentModule, exports: componentModule.exports, require: id => mocks[id] ?? require(id) });
  return {
    focused,
    radioDom,
    render(nextState = actionState) {
      actionState = nextState;
      effects = [];
      refIndex = 0;
      const tree = componentModule.exports.default();
      if (!radioDom.length) radioDom.push(...controls(tree).filter(node => node.props?.type === 'radio').map(node => ({ value: node.props.value, checked: false })));
      effects.forEach(effect => effect());
      return tree;
    },
  };
}
function controls(tree) {
  if (!tree || typeof tree !== 'object') return [];
  return [tree, ...React.Children.toArray(tree.props?.children).flatMap(controls)];
}
const field = (tree, name) => controls(tree).find(node => node.props?.name === name);

test('all entered fields stay controlled through validation and retryable server errors', () => {
  const harness = formHarness();
  let tree = harness.render();
  const expected = { namae: 'テスト太郎', furigana: 'てすとたろう', email: '', message: '入力済みの相談内容' };
  for (const [name, value] of Object.entries(expected)) {
    assert.equal(field(tree, name).props.value, '', `${name} starts controlled`);
    field(tree, name).props.onChange({ target: { value } });
    tree = harness.render();
  }
  const radios = controls(tree).filter(node => node.props?.type === 'radio');
  const selected = radios[1].props.value;
  radios[1].props.onChange({ target: { value: selected } });
  for (const error of [
    { status: 'error', field: 'email', message: 'メールアドレスを入力してください。' },
    { status: 'error', message: '時間をおいて再度お試しください。' },
  ]) {
    harness.radioDom.forEach(input => { input.checked = false; }); // Simulate native action reset.
    tree = harness.render(error);
    for (const [name, value] of Object.entries(expected)) assert.equal(field(tree, name).props.value, value);
    const checked = controls(tree).filter(node => node.props?.type === 'radio' && node.props.checked);
    assert.equal(checked.length, 1);
    assert.equal(checked[0].props.value, selected);
    assert.equal(harness.radioDom.filter(input => input.checked).length, 1);
    assert.equal(harness.radioDom.find(input => input.checked).value, selected);
  }
  assert.deepEqual(harness.focused, ['[name="email"]', '[type="submit"]']);
  tree = harness.render({ status: 'error', field: 'email', message: 'メールアドレスを入力してください。' });
  assert.equal(field(tree, 'email').props['aria-invalid'], true);
  assert.equal(field(tree, 'email').props['aria-describedby'], 'contact-error');
  field(tree, 'email').props.onChange({ target: { value: 'test@example.invalid' } });
  const focusCount = harness.focused.length;
  tree = harness.render();
  assert.equal(harness.focused.length, focusCount, 'typing after an error must not move focus');
  assert.equal(field(tree, 'email').props.value, 'test@example.invalid');
  assert.equal(field(tree, 'namae').props.value, expected.namae);
});

test('native resets are cancelled without clearing entered state', () => {
  const harness = formHarness();
  const tree = harness.render();
  let prevented = false;
  tree.props.onReset({ preventDefault: () => { prevented = true; } });
  assert.equal(prevented, true);
});

test('successful contact state removes the form and focuses the success message', () => {
  const harness = formHarness();
  harness.render();
  const tree = harness.render({ status: 'success', message: '' });
  assert.equal(tree.type, 'p');
  assert.equal(tree.props.role, 'status');
  assert.equal(tree.props.tabIndex, -1);
  assert.equal(field(tree, 'namae'), undefined);
  assert.deepEqual(harness.focused, ['success']);
});
