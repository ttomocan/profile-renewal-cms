import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { createDiaryHarness } from './helpers/diaryPageHarness.mjs';

// ブラウザーが表示幅に合う候補を選び、高DPR向け候補も残すことを確認する。
test('自主運営実績の画像は余白・2列・最大幅を反映したsizesを持つ', async () => {
  const harness = createDiaryHarness({});
  const Component = harness.load('app/_components/WordPressWork/index.tsx').default;
  const html = await harness.render(createElement(Component));
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map(match => match[0]);
  assert.equal(images.length, 2);
  for (const image of images) {
    assert.match(image, /sizes="\(max-width: 767px\) calc\(100vw - 84px\), \(max-width: 879px\) calc\(50vw - 61px\), 379px"/);
    assert.match(image, /loading="lazy"/);
    assert.match(image, /width="1150" height="738"/);
    assert.match(image, /1080w/);
    assert.match(image, /1200w/);
    assert.match(image, /q=75/);
  }
});
