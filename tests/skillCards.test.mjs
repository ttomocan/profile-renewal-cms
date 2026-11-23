import assert from 'node:assert/strict';
import test from 'node:test';
import { createDiaryHarness } from './helpers/diaryPageHarness.mjs';

async function renderCards() {
  const harness = createDiaryHarness({});
  const html = await harness.render(harness.load('app/skill/page.tsx').default());
  return [...html.matchAll(/<article class="programming__item fadeUpTrigger">([\s\S]*?)<\/article>/g)].map(([, markup]) => ({
    title: markup.match(/<h3 class="programming__heading">(.*?)<\/h3>/)?.[1],
    markup,
  }));
}

test('PHPとCMSを分け、その他のCMSを上段CMSに統合した12カードを表示する', async () => {
  const cards = await renderCards();
  assert.deepEqual(cards.map(card => card.title), ['HTML / CSS / SCSS', 'JavaScript', 'PHP', 'CMS', 'Git', 'Webディレクション・進行管理', 'Next.js / React', 'TypeScript', 'microCMS', 'AIを使った開発補助', 'Figma / Adobe', 'その他の補助ツール']);
  const php = cards.find(card => card.title === 'PHP').markup;
  assert.match(php, /PHPを用いたお問い合わせフォームやログイン機能の実装に対応しています。/);
  assert.match(php, /WordPressのカスタマイズにも活用しています。/);
  assert.doesNotMatch(php, /Movable Type|RCMS|カスタムブロック|カスタムフィールド/);
});

test('CMSはWordPress中心の既存経験と他CMSの使用経験、microCMSの個人開発区分を伝える', async () => {
  const cards = await renderCards();
  const cms = cards.find(card => card.title === 'CMS').markup;
  for (const text of ['WordPressを中心にCMSを使用', 'カスタムブロック', 'カスタムフィールド']) assert.ok(cms.includes(text), text);
  assert.match(cms, /Movable TypeとRCMSにも触れた経験/);
  assert.doesNotMatch(cms, /microCMS/);
  assert.match(cards.find(card => card.title === 'Next.js / React').markup, /いろポン！の画面スタイルにTailwind CSSを使用/);
  assert.match(cms, /wordpress-official\.svg/);
  assert.match(cards.find(card => card.title === 'PHP').markup, /img_php\.svg/);
  assert.match(cards.find(card => card.title === 'microCMS').markup, /個人サイトで記事や制作実績を管理/);
});

test('Git FlowとAIツールの役割、自分で行う最終確認を伝える', async () => {
  const cards = await renderCards();
  assert.match(cards.find(card => card.title === 'Git').markup, /Git Flow[\s\S]*feature[\s\S]*release[\s\S]*hotfix/);
  assert.match(cards.find(card => card.title === 'AIを使った開発補助').markup, /ChatGPTで要件と仕様を整理[\s\S]*Cursorで初回実装[\s\S]*Codexで変更差分をレビュー[\s\S]*既存機能への影響は最後に自分で確認/);
});
