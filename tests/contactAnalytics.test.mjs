import assert from 'node:assert/strict';
import test from 'node:test';
import { loadSeoModule } from './helpers/loadSeoModule.mjs';

// フック境界を差し替え、実コンポーネントのイベント処理とeffectを実行する。
// 実ブラウザ・Reactのスケジューリングの検証とは分けて扱う。
function createHarness(analyticsWindow = { dataLayer: [] }, sendError) {
  let state = { status: 'idle', message: '' };
  let refIndex = 0;
  let effects = [];
  const refs = [];
  const calls = [];
  const formAction = async () => {};
  const jsx = (type, props) => ({ type, props });
  const { default: ContactForm } = loadSeoModule('app/_components/ContactForm/index.tsx', {
    react: {
      useActionState: () => [state, formAction],
      useRef: initial => {
        const index = refIndex++;
        refs[index] ??= { current: initial };
        return refs[index];
      },
      useEffect: effect => { effects.push(effect); },
    },
    'react-dom': { useFormStatus: () => ({ pending: false }) },
    'react/jsx-runtime': { jsx, jsxs: jsx, Fragment: 'fragment' },
    '@/app/_actions/contact': { createContactData: formAction },
    '@next/third-parties/google': { sendGAEvent: (...args) => {
      calls.push(args);
      if (sendError) throw sendError;
    } },
  }, { window: analyticsWindow });
  return {
    calls,
    formAction,
    render(nextState = state) {
      state = nextState;
      refIndex = 0;
      effects = [];
      return ContactForm();
    },
    runEffects() { for (const effect of effects) effect(); },
  };
}

test('送信操作だけでは成果イベントを送らず、既存のサーバーアクションを保持する', () => {
  const harness = createHarness();
  const form = harness.render();
  assert.equal(form.type, 'form');
  assert.equal(form.props.action, harness.formAction);
  form.props.onSubmit?.();
  harness.runEffects();
  assert.equal(harness.calls.length, 0);
});

test('成功後に正式なGA形式で1回だけ送信し、個人情報を含めない', () => {
  const harness = createHarness();
  harness.render();
  harness.runEffects();
  const success = harness.render({ status: 'success', message: '個人情報を想定した文字列' });
  assert.equal(success.props.role, 'status');
  harness.runEffects();
  harness.runEffects();
  harness.render({ status: 'success', message: '再レンダリング' });
  harness.runEffects();
  assert.deepEqual(JSON.parse(JSON.stringify(harness.calls)), [['event', 'generate_lead', { form_name: 'contact' }]]);
});

for (const state of [{ status: 'idle', message: '' }, { status: 'error', message: '入力エラー', field: 'email' }, { status: 'error', message: '送信APIエラー' }]) {
  test(`${state.message || state.status}では成果イベントを送らない`, () => {
    const harness = createHarness();
    harness.render(state);
    harness.runEffects();
    assert.equal(harness.calls.length, 0);
  });
}

test('入力エラーを修正して送信に成功したときだけ計測する', () => {
  const harness = createHarness();
  harness.render({ status: 'error', message: '入力エラー', field: 'email' });
  harness.runEffects();
  assert.equal(harness.calls.length, 0);
  harness.render({ status: 'success', message: '成功' });
  harness.runEffects();
  assert.equal(harness.calls.length, 1);
});

for (const analyticsWindow of [{}, { dataLayer: null }, { dataLayer: {} }]) {
  test(`計測未導入・不正なdataLayer (${JSON.stringify(analyticsWindow)})でも成功表示を妨げない`, () => {
    const harness = createHarness(analyticsWindow);
    const success = harness.render({ status: 'success', message: '成功' });
    assert.equal(success.props.role, 'status');
    assert.doesNotThrow(() => harness.runEffects());
    assert.equal(harness.calls.length, 0);
  });
}

test('計測ライブラリが例外を出しても問い合わせ成功表示を妨げない', () => {
  const harness = createHarness({ dataLayer: [] }, new Error('計測の失敗'));
  harness.render({ status: 'success', message: '成功' });
  assert.doesNotThrow(() => harness.runEffects());
  assert.equal(harness.calls.length, 1);
  assert.doesNotThrow(() => harness.runEffects());
  assert.equal(harness.calls.length, 1);
});
