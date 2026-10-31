import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin = process.env.ORIGIN || 'http://127.0.0.1:3237';
assert.match(origin, /^http:\/\/127\.0\.0\.1:\d+$/);
// markupFixture.cjsの固定CMSを使うローカル本番サーバーで実行する。
const output = process.env.OUTPUT || '/tmp/profile-navigation-evidence';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.BROWSER_EXECUTABLE || '/usr/bin/chromium', args: ['--no-sandbox'] });
const evidence = { cases: [], errors: [], blocked: [] };

try {
  for (const width of [1440, 390]) for (const reducedMotion of ['no-preference', 'reduce']) {
    const current = { width, reducedMotion };
    evidence.cases.push(current);
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion, isMobile: width < 768, hasTouch: width < 768 });
    await context.route('**/*', route => {
      const q = route.request();
      if (q.method() !== 'GET' || new URL(q.url()).origin !== origin) {
        evidence.blocked.push({ method: q.method(), url: q.url() });
        return route.abort();
      }
      return route.continue();
    });
    await context.addInitScript(() => {
      window.__scrollTrace = [];
      const record = (kind, args) => window.__scrollTrace.push({ kind, path: location.pathname, y: scrollY, css: getComputedStyle(document.documentElement).scrollBehavior, args });
      const scrollTo = window.scrollTo;
      window.scrollTo = function(...args) { record('scrollTo', args); return scrollTo.apply(this, args); };
      const intoView = Element.prototype.scrollIntoView;
      Element.prototype.scrollIntoView = function(...args) { record('scrollIntoView', args); return intoView.apply(this, args); };
      addEventListener('scroll', () => record('position', []));
      addEventListener('click', event => {
        if (event.target.closest?.('.l-footer a[href="/skill/"]')) {
          window.__footerOriginY = scrollY;
          record('footerClick', []);
        }
      }, true);
    });
    const page = await context.newPage();
    page.on('pageerror', error => evidence.errors.push(error.message));
    const visit = async path => {
      assert.equal((await page.goto(origin + path)).status(), 200);
      await page.waitForSelector('.loading', { state: 'detached' });
    };
    const clear = () => page.evaluate(() => window.__scrollTrace = []);
    const trace = () => page.evaluate(() => window.__scrollTrace);
    const settled = () => page.evaluate(() => new Promise(resolve => {
      let previous = scrollY, stable = 0;
      const frame = () => {
        stable = scrollY === previous ? stable + 1 : 0;
        previous = scrollY;
        if (stable >= 4) resolve();
        else requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }));
    const scroll = async top => {
      await page.waitForFunction(() => document.body.classList.contains(location.pathname.split('/')[1] || 'top'));
      await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), top);
      await page.waitForFunction(() => document.querySelector('.l-header').classList.contains('scroll'));
      await settled();
      await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), top);
      await page.waitForFunction(y => Math.abs(scrollY - y) < 2, top);
    };

    await visit('/about/');
    assert.equal(await page.locator('html').getAttribute('data-scroll-behavior'), 'smooth');
    await page.locator('.l-footer').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('.l-header').classList.contains('scroll'));
    await settled();
    await page.locator('.l-footer').scrollIntoViewIfNeeded();
    await settled();
    let aboutY = await page.evaluate(() => scrollY);
    current.footerAt = aboutY;
    current.aboutGeometry = await page.evaluate(() => ({ height: document.documentElement.scrollHeight, viewport: innerHeight, header: document.querySelector('.l-header').offsetHeight, footer: document.querySelector('.l-footer').getBoundingClientRect().toJSON(), bodyClass: document.body.className }));
    assert.ok(aboutY > 1000);
    await clear();
    await page.locator('.l-footer a[href="/skill/"]').click();
    aboutY = await page.evaluate(() => window.__footerOriginY);
    current.footerAt = aboutY;
    await page.waitForURL(origin + '/skill/');
    await page.waitForFunction(() => scrollY === 0);
    assert.equal(await page.locator('.c-wave').evaluate(e => getComputedStyle(e).marginTop), width < 768 ? '64px' : '48px');
    // 遷移後に中間位置を通って上昇していないことを確認する。
    const forward = await trace();
    current.forward = forward;
    assert.ok(forward.filter(x => x.kind === 'position' && x.path === '/skill/').every(x => x.y === 0));
    assert.ok(forward.every(x => x.kind !== 'scrollTo'), '通常遷移を独自scrollToで上書きしない');

    await scroll(600);
    await settled();
    await page.waitForFunction(() => document.querySelector('.l-header').classList.contains('scroll'));
    await scroll(600);
    current.skillSavedY = await page.evaluate(() => scrollY);
    await clear();
    await page.goBack(); await page.waitForURL(origin + '/about/');
    try {
      await page.waitForFunction(y => Math.abs(scrollY - y) < 2, aboutY, { timeout: 5000 });
    } finally {
      current.back = await trace();
      current.backActual = await page.evaluate(() => scrollY);
      current.backGeometry = await page.evaluate(() => ({ height: document.documentElement.scrollHeight, viewport: innerHeight, header: document.querySelector('.l-header').offsetHeight, footer: document.querySelector('.l-footer').getBoundingClientRect().toJSON(), bodyClass: document.body.className }));
    }
    await settled();
    const back = await trace();
    current.back = back;
    assert.ok(back.every(x => x.kind !== 'scrollTo'), '履歴復元を独自scrollToで上書きしない');
    current.backRestoredTo = await page.evaluate(() => scrollY);
    assert.ok(Math.abs(current.backRestoredTo - aboutY) < 2);
    await clear(); await page.goForward(); await page.waitForURL(origin + '/skill/');
    try {
      await page.waitForFunction(() => Math.abs(scrollY - 600) < 2, null, { timeout: 5000 });
      await settled();
    } finally {
      current.historyForward = await trace();
      current.forwardActual = await page.evaluate(() => scrollY);
    }
    const historyForward = await trace();
    current.historyForward = historyForward;
    assert.ok(historyForward.every(x => x.kind !== 'scrollTo'), '進む操作でも元の位置を復元する');
    current.forwardRestoredTo = await page.evaluate(() => scrollY);
    assert.ok(Math.abs(current.forwardRestoredTo - 600) < 2);

    await visit('/diary/iropon-release/');
    const tocLink = page.locator('nav[aria-labelledby="table-of-contents-title"] a[href="#design&build"]');
    await tocLink.focus(); await clear(); await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.activeElement?.id === 'design&build');
    await page.waitForFunction(() => Math.abs(document.getElementById('design&build').getBoundingClientRect().top - 100) < 3);
    await settled();
    assert.ok(Math.abs(await page.locator('[id="design&build"]').evaluate(e => e.getBoundingClientRect().top) - 100) < 3);
    const samePageAnchor = { hash: new URL(page.url()).hash, focused: await page.evaluate(() => document.activeElement.id) };
    assert.equal(samePageAnchor.hash, '#design&build');

    await page.locator('main a[href="#cms-anchor"]').last().click();
    await page.waitForFunction(() => {
      const header = document.querySelector('.l-header');
      const offset = Math.max(0, header.offsetHeight - (innerWidth > 768 ? 20 : 0));
      return Math.abs(document.getElementById('cms-anchor').getBoundingClientRect().top - offset) < 3;
    });
    const customAnchorCall = (await trace()).filter(x => x.kind === 'scrollTo').at(-1);
    await settled();
    assert.equal(customAnchorCall.args[0].behavior, reducedMotion === 'reduce' ? 'instant' : 'smooth');

    // CMS本文の通常アンカーと同じ経路で、別ページのhashリンクを確認する。
    await page.evaluate(() => {
      const link = document.createElement('a'); link.href = '/diary/site-renewal/#design%26build'; link.textContent = '検証用の別記事アンカー'; link.id = 'cross-page-hash-fixture'; document.querySelector('main').append(link);
    });
    await page.locator('#cross-page-hash-fixture').click();
    await page.waitForURL(origin + '/diary/site-renewal/#design%26build');
    await page.waitForSelector('.loading', { state: 'detached' });
    await page.waitForFunction(() => document.activeElement?.id === 'design&build');
    await page.waitForFunction(() => {
      const top = document.getElementById('design&build').getBoundingClientRect().top;
      return top >= document.querySelector('.l-header').offsetHeight - 1 && top < innerHeight - 40;
    });
    await settled();
    current.crossPageHashPosition = await page.locator('[id="design&build"]').evaluate(e => e.getBoundingClientRect().top);
    assert.equal(await page.locator('[id="design&build"]').evaluate(e => {
      const top = e.getBoundingClientRect().top;
      return top >= document.querySelector('.l-header').offsetHeight - 1 && top < innerHeight - 40;
    }), true);

    await visit('/about/');
    assert.equal(await page.getByRole('link', { name: '個人開発・ブログの活動記録を読む', exact: true }).count(), 0);
    assert.equal(await page.getByRole('link', { name: '自主運営のWordPress実績を見る', exact: true }).count(), 0);
    await page.getByRole('link', { name: '「いろポン！」の目的・開発経緯を読む', exact: true }).click();
    await page.waitForURL(origin + '/diary/iropon-release/');
    await settled();
    current.retainedPersonalWorkLink = true;
    current.removedSupplementalLinks = true;

    await visit('/about/'); await scroll(900); await clear();
    await page.locator('.c-backtotop.show').click();
    await page.waitForFunction(() => scrollY === 0);
    const pageTop = (await trace()).filter(x => x.kind === 'scrollTo').at(-1);
    assert.equal(pageTop.args[0].behavior, reducedMotion === 'reduce' ? 'auto' : 'smooth');
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), reducedMotion === 'reduce' ? 'auto' : 'smooth');
    await page.screenshot({ path: `${output}/navigation-${width}-${reducedMotion}.png` });
    Object.assign(current, { samePageAnchor, customAnchorCall, crossPageHash: true, pageTop, restoredSmoothSetting: true });
    await context.close();
  }
  assert.deepEqual(evidence.errors, []); assert.deepEqual(evidence.blocked, []);
} finally {
  await writeFile(`${output}/browser.json`, JSON.stringify(evidence, null, 2));
  await browser.close();
}
console.log(JSON.stringify(evidence, null, 2));
