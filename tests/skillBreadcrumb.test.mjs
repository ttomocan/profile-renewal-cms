import assert from 'node:assert/strict';
import test from 'node:test';
import { createDiaryHarness } from './helpers/diaryPageHarness.mjs';

test('スキルページの見出しと表示・構造化パンくずは同じページ名を使う', async () => {
  const harness = createDiaryHarness({});
  const { default: Layout, metadata } = harness.load('app/skill/layout.tsx');
  const { default: Page } = harness.load('app/skill/page.tsx');
  const html = await harness.render(Layout({ children: Page() }));
  const heading = html.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1];
  const nav = html.match(/<nav[^>]*aria-label="パンくずリスト"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  const visible = nav?.match(/aria-current="page">([^<]+)<\/span>/)?.[1];
  const breadcrumbs = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map(([, json]) => JSON.parse(json)).filter(json => json['@type'] === 'BreadcrumbList');
  assert.equal(heading, 'Web制作の対応スキル');
  assert.equal(metadata.title, heading + '｜WordPress・Next.js・SEO｜ともきゃん');
  assert.equal(visible, heading);
  assert.equal(breadcrumbs.length, 1);
  assert.equal(breadcrumbs[0].itemListElement.at(-1).name, heading);
});
