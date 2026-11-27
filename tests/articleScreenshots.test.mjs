import assert from 'node:assert/strict';
import test from 'node:test';
import { createDiaryHarness } from './helpers/diaryPageHarness.mjs';

const { getArticleContent } = createDiaryHarness({}).load('lib/articleContent.ts');
const cms = 'https://images.microcms-assets.io/assets/764831a5a2c84d3c982ee2d40033122f';
const home = `${cms}/c96db3ae4ab5488fa7e8a63f4c24d4df/iropon-premium-home.jpg`;
const quiz = `${cms}/d24edc1a4067414ebfd123cb59c11b42/iropon-quiz.jpg`;
const premium = `${cms}/245fa6ac64d846f09c405d3bb798934c/iropon-premium-unlocked.jpg`;
const img = src => `<img src="${src}" alt="" width="1165" height="747">`;
const figure = (src, caption) => `<figure>${img(src)}<figcaption>${caption}</figcaption></figure>`;

test('いろポン開発記の既存3枚を現行画面に差し替え、公開案内を購入後の画面と呼ばない', () => {
  const content = '<p>開発時の本文</p>' + figure(home, 'トップページ') + figure(quiz, 'クイズ画面')
    + figure(premium, 'プレミアム解放後の画面');
  const result = getArticleContent({ id: 'iropon-release', content });
  assert.match(result, /^<p>開発時の本文<\/p>/);
  assert.match(result, /iropon-release\/home.webp" alt="[^"]+" width="1355" height="931"/);
  assert.match(result, /iropon-release\/quiz.webp" alt="[^"]+" width="1363" height="936"/);
  assert.match(result, /iropon-release\/premium-guide.webp" alt="[^"]+" width="1355" height="931"/);
  assert.match(result, /<figcaption>プレミアムの料金・学習範囲の案内（公開画面）<\/figcaption>/);
  assert.doesNotMatch(result, /iropon-premium-home.jpg|iropon-quiz.jpg|iropon-premium-unlocked.jpg|プレミアム解放後の画面/);
});

test('他の記事とCMSで更新済みの別画像には触れない', () => {
  const content = figure(premium, 'プレミアム解放後の画面') + figure('/img/a-new-cms-asset.jpg', '別の画像');
  assert.equal(getArticleContent({ id: 'other-article', content }), content);
  const updated = figure('/img/a-new-cms-asset.jpg', 'プレミアム解放後の画面');
  assert.equal(getArticleContent({ id: 'iropon-release', content: updated }), updated);
});

test('既存のビュッフェ記事用の差し替えを維持する', () => {
  const source = `${cms}/7114714a07d34bcf847a410e771b45f9/img_buffet-life-parenting-1yearhalf.jpeg?w=500&amp;h=272`;
  const content = img(source);
  assert.match(getArticleContent({ id: 'buffet-life-parenting-1yearhalf', content }), /buffet-life-illustration.webp" alt="" width="1697" height="927"/);
});
