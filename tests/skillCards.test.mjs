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

test('PHPと隣接するCMSカードを分け、既存12カードを保持して13カードにする', async () => {
  const cards = await renderCards();
  assert.deepEqual(cards.map(card => card.title), ['HTML / CSS / SCSS', 'JavaScript', 'PHP', 'CMS', 'Git', 'Webディレクション・進行管理', 'Next.js / React', 'TypeScript', 'microCMS', 'Tailwind CSS', 'ChatGPT / Claude / Gemini / Codex / gemini Notebook', 'Figma / Adobe', 'その他の補助ツール']);
  const php = cards.find(card => card.title === 'PHP').markup;
  assert.match(php, /PHPを用いたお問い合わせフォームやログイン機能の実装に対応しています。/);
  assert.match(php, /WordPressのカスタマイズにも活用しています。/);
  assert.doesNotMatch(php, /Movable Type|RCMS|カスタムブロック|カスタムフィールド/);
});

test('CMSはWordPress中心の既存経験と他CMSの使用経験、microCMSの個人開発区分を伝える', async () => {
  const cards = await renderCards();
  const cms = cards.find(card => card.title === 'CMS').markup;
  for (const text of ['WordPressを中心にCMSを使用', 'Movable Type・RCMSの使用経験', 'microCMSは個人開発で使用', 'カスタムブロック', 'カスタムフィールド']) assert.ok(cms.includes(text), text);
  assert.match(cms, /wordpress-official\.svg/);
  assert.match(cards.find(card => card.title === 'PHP').markup, /img_php\.svg/);
  assert.match(cards.find(card => card.title === 'microCMS').markup, /個人サイトで記事や制作実績を管理/);
});
