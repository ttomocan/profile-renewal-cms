import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin = process.env.ORIGIN || 'http://127.0.0.1:3211';
assert.match(origin, /^http:\/\/127\.0\.0\.1:\d+$/);
const output = process.env.OUTPUT || '/tmp/profile-perf/regression';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.BROWSER_EXECUTABLE || '/usr/bin/chromium', args: ['--no-sandbox'] });
const checks = [], errors = [];
try {
  const html = await (await fetch(origin + '/')).text();
  assert.equal(html.includes('PROFILE_FIXTURE_BODY_ONLY'), false, 'トップで使わない記事本文をブラウザへ送らない');
  checks.push('未使用の記事本文をトップのHTML/RSCから除外');
  for (const width of [320, 390, 767, 768, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: 'reduce' });
    await context.route('**/*', route => {
      if (route.request().method() === 'POST' || new URL(route.request().url()).hostname !== '127.0.0.1') return route.abort();
      return route.continue();
    });
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(origin);
    await page.waitForSelector('.loading', { state: 'detached' });
    await page.waitForTimeout(500);
    assert.equal(await page.locator('.card-slider').count(), 2);
    for (const kind of ['results', 'diary']) {
      const slider = page.locator(`.${kind}-slider-wrapper`);
      await slider.scrollIntoViewIfNeeded();
      const slides = slider.locator('.splide__slide');
      assert.equal(await slides.count(), 6);
      assert.equal(await slider.locator('a').count(), 6);
      assert.equal(await slider.locator('.splide__slide--clone').count(), 0);
      const display = await slider.locator('.splide__list').evaluate(e => getComputedStyle(e).display);
      assert.equal(display, width < 768 ? 'flex' : 'grid');
      if (width < 768) {
        const next = slider.locator('.splide__arrow--next');
        for (let i = 1; i < 6; i++) {
          await next.focus(); await page.keyboard.press('Enter');
          await page.waitForTimeout(50);
          assert.equal(await slides.nth(i).getAttribute('aria-hidden'), null);
          assert.ok((await slider.locator('[aria-hidden="true"] a').evaluateAll(nodes => nodes.map(e => e.tabIndex))).every(t => t === -1));
        }
        assert.equal(await slides.nth(5).evaluate(e => e.classList.contains('is-active')), true);
        // 本体CSSを含む基準ビルドでも末尾ボタンはdisabledにならないため、到達位置を確認する。
        if (!await next.isDisabled()) {
          await next.click(); await page.waitForTimeout(50);
          assert.equal(await slides.nth(5).evaluate(e => e.classList.contains('is-active')), true);
        }
        await slider.locator('.splide__arrow--prev').click();
        await page.waitForTimeout(50);
        assert.equal(await slides.nth(4).getAttribute('aria-hidden'), null);
      }
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.screenshot({ path: `${output}/home-${width}.png`, fullPage: true });
    if (width === 390) {
      await page.evaluate(() => scrollTo(0, 0));
      await page.getByRole('button', { name: 'メニューを開く', exact: true }).click();
      assert.equal(await page.locator('.l-content').evaluate(e => e.inert), true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('.l-content').evaluate(e => e.inert), false);
      await page.getByRole('button', { name: 'メニューを開く', exact: true }).click();
      await page.locator('#global-menu nav').getByRole('link', { name: 'Result', exact: true }).click();
      await page.waitForURL(origin + '/result/');
      await page.getByRole('link', { name: '計測用の制作実績 1の制作実績を見る', exact: true }).click();
      await page.waitForURL(origin + '/result/corporate-handball-team-01/');
      await page.getByRole('link', { name: '実績紹介に戻る' }).click();
      await page.waitForURL(origin + '/result/');
      await page.locator('.l-header__logo a').click();
      await page.waitForURL(origin + '/');
      await page.waitForTimeout(500);
      await page.locator('.diary-slider-wrapper').scrollIntoViewIfNeeded();
      await page.getByRole('button', { name: '次の記事を表示' }).click();
      await page.waitForTimeout(100);
      assert.equal(await page.locator('.diary-slider-wrapper .splide__slide').nth(1).getAttribute('aria-hidden'), null);
      await page.goto(origin + '/diary/iropon-release/');
      await page.getByRole('navigation', { name: '目次', exact: true }).getByRole('link', { name: '確認結果' }).click();
      assert.match(page.url(), /#section-/);
      await page.goto(origin + '/diary/');
      assert.equal(await page.getByRole('heading', { name: '開発・学習のおすすめ記事' }).count(), 1);
      await page.goto(origin + '/diary/p/2/');
      assert.equal((await page.locator('link[rel="canonical"]').getAttribute('href')), 'https://www.tomocan.site/diary/p/2/');
      await page.goto(origin + '/result/p/2/');
      assert.equal(await page.getByRole('link', { name: '計測用の制作実績 13の制作実績を見る', exact: true }).count(), 1);
      await page.goto(origin + '/contact/');
      assert.ok(await page.locator('form').count());
      assert.ok(await page.locator('input[type="email"]').isVisible());
      checks.push('SPメニュー・背景inert・Escape・実績往復・記事目次・一覧ページ送り・フォーム表示（送信なし）');
    }
    checks.push(`${width}px: カード件数、画像なし、操作、非表示リンク、グリッド、横はみ出し`);
    await context.close();
  }
  const normal = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  const resizePage = await normal.newPage();
  resizePage.on('pageerror', e => errors.push(e.message));
  await resizePage.goto(origin); await resizePage.waitForTimeout(1000);
  await resizePage.locator('.diary-slider-wrapper .splide__slide:last-child a').focus();
  await resizePage.setViewportSize({ width: 767, height: 844 }); await resizePage.waitForTimeout(600);
  assert.equal(await resizePage.evaluate(() => document.activeElement.closest('[aria-hidden="true"]') === null), true);
  await resizePage.setViewportSize({ width: 768, height: 844 }); await resizePage.waitForTimeout(500);
  assert.equal(await resizePage.locator('.card-slider a[tabindex="-1"]').count(), 0);
  assert.equal(await resizePage.locator('.card-slider .splide__slide[aria-hidden="true"]').count(), 0);
  await resizePage.setViewportSize({ width: 390, height: 844 }); await resizePage.waitForTimeout(500);
  const diary = resizePage.locator('.diary-slider-wrapper'); await diary.scrollIntoViewIfNeeded();
  await diary.locator('.splide__arrow--next').click(); await resizePage.waitForTimeout(500);
  assert.equal(await diary.locator('.splide__slide').nth(1).evaluate(e => e.classList.contains('is-active')), true);
  await resizePage.waitForTimeout(1000);
  assert.equal(await diary.locator('.splide__slide').nth(1).evaluate(e => e.classList.contains('is-active')), true);
  await diary.locator('.splide__arrow--prev').click(); await resizePage.waitForTimeout(500);
  assert.equal(await diary.locator('.splide__slide').nth(0).evaluate(e => e.classList.contains('is-active')), true);
  checks.push('通常モーションの前後移動・自動再生なし、767↔768pxでフォーカスとtabindexを復元');
  await normal.close();
  const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await nojs.newPage(); await page.goto(origin);
  assert.equal(await page.locator('.card-slider a').count(), 12);
  assert.equal(await page.locator('.card-slider').first().isVisible(), true);
  checks.push('JSなしでも12枚のカードとリンクをSSR表示');
  await nojs.close();
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ checks, errors }, null, 2));
  await writeFile(`${output}/checks.json`, JSON.stringify({ checks, errors }, null, 2));
} finally { await browser.close(); }
