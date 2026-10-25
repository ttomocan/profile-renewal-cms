// 自動先読みを有効にし、load後6秒待機したクライアント遷移の補助計測。
// driverのURL/selector待機を含むDOM到達時間で、INPや完全な描画完了時間ではない。
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const output = process.env.OUTPUT || '/tmp/profile-perf/navigation';
await mkdir(output, { recursive: true });
const targets = process.argv.slice(2).map(arg => { const i = arg.indexOf('='); return { label: arg.slice(0, i), origin: arg.slice(i + 1) }; });
assert.equal(targets.length, 2);
for (const t of targets) assert.match(t.origin, /^http:\/\/127\.0\.0\.1:\d+$/);
const browser = await chromium.launch({ executablePath: process.env.BROWSER_EXECUTABLE || '/usr/bin/chromium', args: ['--no-sandbox'] });
const results = [];
try {
  for (let run = 0; run < Number(process.env.RUNS || 5); run++) {
    for (const t of run % 2 ? [...targets].reverse() : targets) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true,
        userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36' });
      await context.addInitScript(() => document.addEventListener('click', e => {
        if (e.target.closest('a[href]')) window.__navigationStart = performance.now();
      }, true));
      const page = await context.newPage(), cdp = await context.newCDPSession(page), errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750, connectionType: 'cellular4g' });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await page.goto(t.origin); await page.waitForTimeout(6000);
      const timeOrigin = await page.evaluate(() => performance.timeOrigin);
      const measure = async (name, link, destination, selector) => {
        await link.click(); await page.waitForURL(t.origin + destination);
        await page.waitForFunction(selector => Boolean(document.querySelector(selector)), selector);
        const ms = await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve(performance.now() - window.__navigationStart)))));
        assert.equal(await page.evaluate(() => performance.timeOrigin), timeOrigin, '同じドキュメントでクライアント遷移する');
        assert.ok(Number.isFinite(ms));
        const result = { target: t.label, run: run + 1, name, ms, errors: [...errors] };
        results.push(result); console.log(JSON.stringify(result));
      };
      await measure('トップ→実績一覧', page.locator('.p-top-hero__actions a[href="/result/"]'), '/result/', '.results-grid .result-card__title');
      await page.waitForTimeout(1500);
      await page.getByRole('button', { name: 'メニューを開く', exact: true }).click(); await page.waitForTimeout(500);
      await measure('メニュー→日記一覧', page.locator('#global-menu nav').getByRole('link', { name: 'Diary', exact: true }), '/diary/', 'section[aria-label="記事一覧"] article');
      assert.deepEqual(errors, []);
      await writeFile(`${output}/runs.json`, JSON.stringify(results, null, 2));
      await context.close();
    }
  }
} finally { await browser.close(); }
const summary = {};
for (const name of new Set(results.map(e => e.name))) {
  summary[name] = {};
  for (const t of targets) {
    const values = results.filter(e => e.name === name && e.target === t.label).map(e => e.ms).toSorted((a, b) => a - b);
    summary[name][t.label] = { median: values[Math.floor(values.length / 2)], min: values[0], max: values.at(-1), n: values.length };
  }
}
await writeFile(`${output}/summary.json`, JSON.stringify(summary, null, 2));
