import assert from 'node:assert/strict';
import test from 'node:test';
import { createDiaryHarness } from './helpers/diaryPageHarness.mjs';

async function renderSkillPage() {
  const harness = createDiaryHarness({});
  return harness.render(harness.load('app/skill/page.tsx').default());
}

async function renderCards() {
  const html = await renderSkillPage();
  return [...html.matchAll(/<article class="programming__item fadeUpTrigger">([\s\S]*?)<\/article>/g)].map(([, markup]) => ({
    title: markup.match(/<h3 class="programming__heading(?: programming__heading--split)?">(.*?)<\/h3>/)?.[1].replace(/<[^>]+>/g, ''),
    markup,
  }));
}

test('PHPとCMSを分け、その他のCMSを上段CMSに統合した13カードを表示する', async () => {
  const cards = await renderCards();
  assert.deepEqual(cards.map(card => card.title), ['HTML / CSS / SCSS', 'JavaScript', 'PHP', 'CMS', 'Git', 'Webディレクション・進行管理', 'Next.js / React', 'TypeScript', 'microCMS', 'AIを使った開発補助', '仕様・資料の作成と整理', 'Figma / Adobe', 'その他の補助ツール']);
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

test('Git Flowの概要と指定されたGitの3項目を伝える', async () => {
  const cards = await renderCards();
  const git = cards.find(card => card.title === 'Git').markup;
  assert.match(git, /Git Flowに沿って開発・リリース・緊急修正のブランチを使い分けます/);
  assert.deepEqual([...git.matchAll(/<li>(.*?)<\/li>/g)].map(([, value]) => value), ['ブランチを使った機能開発・修正', '差分確認とレビューを前提にしたコミット', 'GitHubを使ったコード管理']);
});

test('AIの開発フローに既存カードとGemini Notebookの独立したカードを表示する', async () => {
  const html = await renderSkillPage();
  const aiSection = html.match(/<section class="ai-tool inner">([\s\S]*?)<\/section>/)?.[1];
  assert.ok(aiSection);
  assert.match(aiSection, /<h2[^>]*><span class="c-heading-lv2-en">AI-Assisted Development<\/span><span class="c-heading-lv2-ja">AIを活用した開発フロー<\/span><\/h2>/);
  const aiCards = [...aiSection.matchAll(/<article class="programming__item fadeUpTrigger">([\s\S]*?)<\/article>/g)].map(([, markup]) => markup);
  assert.equal(aiCards.length, 2);
  const [development, notebook] = aiCards;
  assert.match(development, /<h3 class="programming__heading">AIを使った開発補助<\/h3>/);
  assert.doesNotMatch(development, /Gemini Notebook|NotebookLM/);
  assert.deepEqual([...development.matchAll(/<li>(.*?)<\/li>/g)].map(([, value]) => value), [
    'ChatGPTで要件と仕様を整理',
    'Cursorで初回実装',
    'Codexで変更差分をレビュー',
    '仕様との一致、表示・動作、既存機能への影響は最後に自分で確認',
  ]);
  assert.match(notebook, /<h3 class="programming__heading">仕様・資料の作成と整理<\/h3>/);
  assert.match(notebook, /業務ではGemini Notebook（旧NotebookLM）を使い、仕様や資料の作成・整理を行っています。/);
  assert.match(notebook, /<div class="programming__image" aria-hidden="true"><svg\b/);
});

test('Webディレクションの見出しは中点の直後でのみ折り返せる', async () => {
  const cards = await renderCards();
  const direction = cards.find(card => card.title === 'Webディレクション・進行管理').markup;
  assert.match(direction, /<h3 class="programming__heading programming__heading--split"><span>Webディレクション・<\/span><wbr\s*\/?><span>進行管理<\/span><\/h3>/);
  assert.equal(cards.filter(card => /<wbr/.test(card.markup)).length, 1);
});
