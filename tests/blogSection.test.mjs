import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { createDiaryHarness } from './helpers/diaryPageHarness.mjs';

const copies = {
  home: '個人活動として、ボイストレーニングとブログデザインの2つのブログを運営しています。実体験とWeb制作者の視点から、読者が実践しやすい情報を発信しています。',
  about: '個人で2つのブログを企画・制作・運営しています。継続的な発信を通して、記事設計、UI改善、SEO、運用の知見を深めています。',
  skill: 'ボイトレや話し方に関する情報を「ともきゃんのボイトレ生活」で、WebデザインやWordPressの学習に役立つ情報、資格・参考書の紹介を「ブログデザインマニア」で発信しています。',
  diary: '活動記録とは別に、ボイストレーニングとブログデザインの専門ブログも継続して運営しています。',
  contact: '運営しているブログやメディアに関するお問い合わせは、上記フォームから受け付けています。',
};

for (const [variant, expectedCopy] of Object.entries(copies)) {
  test(`運営ブログ ${variant}: 本文と遷移先を保持し、PC限定改行と「を見る」を持つ`, async () => {
    const harness = createDiaryHarness({});
    const Blog = harness.load('app/_components/Blog/index.tsx').default;
    const html = await harness.render(createElement(Blog, { variant }));
    const lead = html.match(/<p class="l-blog-area__lead fadeUpTrigger">([\s\S]*?)<\/p>/)?.[1];
    assert.ok(lead);
    assert.equal(lead.replace(/<[^>]*>/g, ''), expectedCopy);
    assert.match(lead, /<br class="u-pc-only"\/?\s*>/);
    assert.doesNotMatch(lead, /<br\s*\/?>/);
    const links = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)];
    assert.deepEqual(links.map(([, , text]) => text.trim()), ['ともきゃんのボイトレ生活を見る', 'ブログデザインマニアを見る']);
    assert.deepEqual(links.map(([, attributes]) => attributes.match(/href="([^"]+)"/)[1]), ['https://www.newagevoice.com/', 'https://www.blogdesign-mania.com/']);
    for (const [, attributes] of links) { assert.match(attributes, /target="_blank"/); assert.match(attributes, /rel="noopener noreferrer"/); }
  });
}

test('Aboutは確定2リンクのみ削除し、個人開発の本文といろポンの開発経緯リンクを残す', async () => {
  const harness = createDiaryHarness({});
  const html = await harness.render(harness.load('app/about/page.tsx').default());
  assert.doesNotMatch(html, /個人開発・ブログの活動記録を読む|自主運営のWordPress実績を見る/);
  assert.match(html, /個人開発・発信活動/);
  assert.match(html, /色をクイズで覚える個人開発のWebアプリです。/);
  const related = html.match(/<div class="about-related-links fadeUpTrigger">([\s\S]*?)<\/div>/)?.[1];
  assert.ok(related);
  assert.equal((related.match(/<a\b/g) || []).length, 1);
  assert.match(related, /href="\/diary\/iropon-release\/?"/);
  assert.match(related, /「いろポン！」の目的・開発経緯を読む/);
});
