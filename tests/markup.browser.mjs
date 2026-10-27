import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin = process.env.ORIGIN || 'http://127.0.0.1:3218';
assert.match(origin, /^http:\/\/127\.0\.0\.1:\d+$/);
const output = process.env.OUTPUT || '/tmp/profile-a11y-evidence';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.BROWSER_EXECUTABLE || '/usr/bin/chromium', args: ['--no-sandbox'] });
const evidence = { routes: [], controls: [], errors: [], blockedRequests: [] };
const luminance = color => color.match(/\d+/g).slice(0, 3).map(Number).map(c => c / 255)
  .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);
async function isolate(context) {
  await context.route('**/*', route => {
    const request = route.request();
    if (request.method() !== 'GET' || new URL(request.url()).origin !== origin) {
      evidence.blockedRequests.push({ method: request.method(), url: request.url() });
      return route.abort();
    }
    return route.continue();
  });
}
async function visit(page, path) {
  const response = await page.goto(origin + path);
  await page.waitForSelector('.loading', { state: 'detached' });
  return response.status();
}

try {
  const routes = ['/', '/about/', '/skill/', '/contact/', '/diary/', '/diary/p/2/', '/diary/category/activity/', '/diary/category/activity/p/2/', '/diary/search/?q=開発', '/diary/iropon-release/', '/result/', '/result/p/2/', '/result/corporate-handball-team-01/', '/missing/', '/diary/missing/'];
  for (const width of [1440, 390, 320]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    await isolate(context);
    const page = await context.newPage();
    page.on('pageerror', error => evidence.errors.push(error.message));
    for (const path of routes) {
      const status = await visit(page, path);
      assert.equal(await page.locator('main').count(), 1, path);
      assert.equal(await page.locator('main#main[tabindex="-1"]').count(), 1, path);
      assert.equal(await page.locator('.skip-link').count(), 1, path);
      await page.keyboard.press('Tab');
      assert.equal(await page.locator('.skip-link').evaluate(e => e === document.activeElement), true, path);
      assert.ok((await page.locator('.skip-link').boundingBox()).y >= 0);
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('main').evaluate(e => e === document.activeElement), true, path);
      await page.keyboard.press('Tab');
      assert.equal(await page.locator('main').evaluate(e => e.contains(document.activeElement)), true, path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      assert.equal(overflow, false, `${width}px ${path}`);
      if (path.includes('missing')) assert.equal(status, 404);
      else assert.equal(status, 200);
      evidence.routes.push({ width, path, status, mainFocus: true, nextTabInMain: true, overflow });
    }

    await visit(page, '/diary/');
    const select = page.locator('#diary-category');
    await select.focus();
    await page.keyboard.press('Home');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Tab');
    assert.equal(await select.inputValue(), 'activity');
    assert.equal(new URL(page.url()).pathname, '/diary/');
    const submit = page.getByRole('button', { name: '表示する', exact: true });
    assert.equal(await submit.evaluate(e => e === document.activeElement), true);
    await page.screenshot({ path: `${output}/category-${width}.png` });
    await page.keyboard.press('Enter');
    await page.waitForURL(`${origin}/diary/category/activity/`);
    await page.goBack();
    await select.selectOption('');
    await submit.focus();
    await page.keyboard.press('Enter');
    await page.waitForURL(`${origin}/diary/`);
    await page.goto(`${origin}/diary/?category=activity`);
    assert.equal(await select.inputValue(), 'activity');
    await select.selectOption('');
    await submit.click();
    await page.waitForURL(`${origin}/diary/`);
    assert.equal(await select.inputValue(), '');

    const next = page.getByRole('link', { name: '次のページへ', exact: true });
    assert.equal(await next.getAttribute('href'), '/diary/p/2/');
    await next.focus();
    await page.keyboard.press('Enter');
    await page.waitForURL(`${origin}/diary/p/2/`);
    await page.getByRole('link', { name: '前のページへ', exact: true }).click();
    await page.waitForURL(`${origin}/diary/`);

    const footer = page.locator('.l-footer');
    const footerColors = await footer.evaluate(e => ({ background: getComputedStyle(e).backgroundColor, text: getComputedStyle(e.querySelector('a')).color }));
    assert.ok(contrast(footerColors.background, footerColors.text) >= 4.5);
    const footerLinks = footer.locator('a');
    await page.keyboard.press('Tab');
    await footerLinks.first().focus();
    for (let i = 0; i < await footerLinks.count(); i++) {
      assert.equal(await footerLinks.nth(i).evaluate(e => e === document.activeElement), true);
      const outline = await footerLinks.nth(i).evaluate(e => ({ color: getComputedStyle(e).outlineColor, width: getComputedStyle(e).outlineWidth }));
      assert.ok(contrast(outline.color, footerColors.background) >= 3);
      assert.ok(parseFloat(outline.width) >= 3);
      if (i === 0) await footer.screenshot({ path: `${output}/footer-${width}.png` });
      await page.keyboard.press('Tab');
    }

    await visit(page, '/diary/iropon-release/');
    assert.equal(await page.locator('h2#section-2').count(), 1);
    const toc = page.locator('nav[aria-labelledby="table-of-contents-title"]');
    await toc.locator('a[href="#cms-anchor"]').focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('#cms-anchor').evaluate(e => e === document.activeElement), true);
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute('href')), '#cms-anchor');
    await page.goBack();
    await toc.locator('a[href="#design&build"]').click();
    assert.equal(await page.evaluate(() => document.activeElement.id), 'design&build');
    await visit(page, '/about/');
    await visit(page, '/diary/iropon-release/#design%26build');
    await page.waitForTimeout(200);
    assert.equal(await page.evaluate(() => document.activeElement.id), 'design&build');
    const ids = await page.locator('main [id]').evaluateAll(nodes => nodes.map(e => e.id));
    assert.equal(new Set(ids).size, ids.length);

    await visit(page, '/result/corporate-handball-team-01/');
    const json = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.map(n => JSON.parse(n.textContent)));
    const work = json.find(item => item['@type'] === 'CreativeWork');
    assert.deepEqual(work.about, [{ '@type': 'Thing', name: 'メイン業務' }, { '@type': 'Thing', name: 'フロントエンド開発' }, { '@type': 'Thing', name: 'CMS構築' }]);
    evidence.controls.push({ width, categorySubmit: true, categoryReset: true, pagination: true, footerContrast: contrast(footerColors.background, footerColors.text), footerLinks: await footerLinks.count(), tocExistingAnchor: true, directHash: true, structuredData: work.about });
    await context.close();
  }

  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await isolate(noJs);
  const page = await noJs.newPage();
  await page.goto(origin + '/diary/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('main').evaluate(e => e === document.activeElement), true);
  await page.locator('#diary-category').selectOption('activity');
  await page.getByRole('button', { name: '表示する', exact: true }).click();
  await page.waitForURL(`${origin}/diary/?category=activity`);
  await page.locator('#diary-category').selectOption('');
  await page.getByRole('button', { name: '表示する', exact: true }).click();
  await page.waitForURL(`${origin}/diary/?category=`);
  assert.ok(await page.locator('main a[href*="/diary/iropon-release"]').count() > 0);
  evidence.noJavaScript = { skipFocus: true, categorySubmit: true, resetAll: true };
  await noJs.close();
  assert.deepEqual(evidence.errors, []);
  console.log(JSON.stringify({ routes: evidence.routes.length, controls: evidence.controls, noJavaScript: evidence.noJavaScript, errors: evidence.errors }, null, 2));
} finally {
  await writeFile(`${output}/results.json`, JSON.stringify(evidence, null, 2));
  await browser.close();
}
