// 別途インストール済みのPlaywrightを使う。製品の依存関係は追加しない。
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const targets = process.argv.slice(2).map(arg => { const at = arg.indexOf('='); return { label: arg.slice(0, at), origin: arg.slice(at + 1) }; });
if (!targets.length) throw new Error('before=http://127.0.0.1:3210 after=http://127.0.0.1:3211 を指定してください');
for (const target of targets) {
  if (!/^http:\/\/127\.0\.0\.1:\d+$/.test(target.origin)) throw new Error('ローカル計測だけに対応します');
}
const routes = ['/', '/result/', '/result/corporate-handball-team-01/', '/diary/', '/diary/iropon-release/', '/contact/'];
const runs = Number(process.env.RUNS || 5), output = process.env.OUTPUT || '/tmp/profile-perf/measurement';
await mkdir(output, { recursive: true });
const settings = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true,
  userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36' };
const network = { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750, connectionType: 'cellular4g' };
const browser = await chromium.launch({ executablePath: process.env.BROWSER_EXECUTABLE || '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
const data = { conditions: { kind: 'ローカル固定CMS・production build・ラボ値', browser: browser.version(), node: process.version,
  platform: `${os.platform()} ${os.arch()}`, cpu: os.cpus()[0]?.model, logicalCPUs: os.cpus().length,
  settings, network, cpuSlowdown: 4, cache: '各回新規context、HTTPキャッシュ無効、サーバー画像キャッシュは事前ウォーム', observationAfterLoadMs: 6000, runs }, results: [] };
try {
  for (let run = 0; run < runs; run++) {
    for (const route of routes) {
      for (const target of run % 2 ? [...targets].reverse() : targets) {
        const context = await browser.newContext(settings);
        await context.addInitScript(() => {
          window.__perf = { lcp: null, cls: 0, overlayRemovedMs: null, longTasks: [], events: [] };
          let shiftStart = 0, shiftLast = 0, shiftValue = 0, sawOverlay = false;
          const overlayObserver = new MutationObserver(() => {
            if (document.querySelector('.loading')) sawOverlay = true;
            else if (sawOverlay) { window.__perf.overlayRemovedMs = performance.now(); overlayObserver.disconnect(); }
          });
          overlayObserver.observe(document, { childList: true, subtree: true });
          new PerformanceObserver(list => { for (const e of list.getEntries()) window.__perf.lcp = { ms: e.startTime, url: e.url, element: e.element?.className || e.element?.tagName }; }).observe({ type: 'largest-contentful-paint', buffered: true });
          new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) {
            if (shiftValue > 0 && e.startTime - shiftLast < 1000 && e.startTime - shiftStart < 5000) shiftValue += e.value;
            else { shiftStart = e.startTime; shiftValue = e.value; }
            shiftLast = e.startTime; window.__perf.cls = Math.max(window.__perf.cls, shiftValue);
          } }).observe({ type: 'layout-shift', buffered: true });
          new PerformanceObserver(list => { for (const e of list.getEntries()) window.__perf.longTasks.push({ start: e.startTime, duration: e.duration }); }).observe({ type: 'longtask', buffered: true });
          new PerformanceObserver(list => { for (const e of list.getEntries()) window.__perf.events.push({ name: e.name, duration: e.duration, interactionId: e.interactionId }); }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
        });
        const page = await context.newPage(), cdp = await context.newCDPSession(page), errors = [];
        page.on('pageerror', error => errors.push(error.message));
        const traffic = new Map();
        await cdp.send('Network.enable');
        await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
        await cdp.send('Network.emulateNetworkConditions', network);
        await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
        cdp.on('Network.responseReceived', e => traffic.set(e.requestId, { type: e.type, url: e.response.url.replace(target.origin, ''), status: e.response.status, mime: e.response.mimeType, bytes: 0 }));
        cdp.on('Network.loadingFinished', e => { if (traffic.has(e.requestId)) traffic.get(e.requestId).bytes = e.encodedDataLength; });
        const response = await page.goto(target.origin + route, { waitUntil: 'load', timeout: 60000 });
        if (response.status() !== 200) throw new Error(`${route}: ${response.status()}`);
        const html = await response.text();
        await page.waitForTimeout(6000);
        const initial = await page.evaluate(() => {
          const nav = performance.getEntriesByType('navigation')[0];
          const resources = performance.getEntriesByType('resource').map(e => ({ name: e.name, initiator: e.initiatorType, encoded: e.encodedBodySize, decoded: e.decodedBodySize, duration: e.duration }));
          const visible = document.body.cloneNode(true);
          visible.querySelectorAll('script,style,link,.loading').forEach(e => e.remove());
          return { ...window.__perf, fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
            ttfb: nav.responseStart, domContentLoaded: nav.domContentLoadedEventEnd, load: nav.loadEventEnd,
            documentEncoded: nav.encodedBodySize, documentDecoded: nav.decodedBodySize, resources,
            visibleText: visible.textContent.replace(/\s+/g, ' ').trim(),
            metadata: [...document.querySelectorAll('title,meta[name="description"],meta[name="robots"],meta[property^="og:"],link[rel="canonical"],script[type="application/ld+json"]')].map(e => e.outerHTML),
            links: [...document.querySelectorAll('a[href]')].map(e => ({ href: e.getAttribute('href'), text: e.textContent.trim(), label: e.getAttribute('aria-label') })),
            images: [...document.images].map(e => ({ src: e.currentSrc.replace(location.origin, ''), width: e.getBoundingClientRect().width, height: e.getBoundingClientRect().height, complete: e.complete, natural: e.naturalWidth })),
            overflow: document.documentElement.scrollWidth > innerWidth };
        });
        const initialTraffic = [...traffic.values()];
        const scripts = initial.resources.filter(e => e.initiator === 'script');
        const metrics = { fcpMs: initial.fcp, lcpMs: initial.lcp?.ms, cls: initial.cls, overlayRemovedMs: initial.overlayRemovedMs, ttfbMs: initial.ttfb,
          loadMs: initial.load, observedBlockingMs: initial.longTasks.reduce((sum, e) => sum + Math.max(0, e.duration - 50), 0),
          transferBytes: initialTraffic.reduce((sum, e) => sum + e.bytes, 0),
          jsTransferBytes: initialTraffic.filter(e => e.type === 'Script').reduce((sum, e) => sum + e.bytes, 0),
          jsDecodedBytes: scripts.reduce((sum, e) => sum + e.decoded, 0),
          imageTransferBytes: initialTraffic.filter(e => e.type === 'Image').reduce((sum, e) => sum + e.bytes, 0),
          documentEncodedBytes: initial.documentEncoded, documentDecodedBytes: initial.documentDecoded };
        await page.getByRole('button', { name: 'メニューを開く', exact: true }).click();
        await page.waitForFunction(() => document.querySelector('[aria-controls="global-menu"]')?.getAttribute('aria-expanded') === 'true');
        await page.waitForTimeout(400);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        const events = await page.evaluate(() => window.__perf.events.filter(e => e.interactionId));
        metrics.menuEventMaxMs = events.length ? Math.max(...events.map(e => e.duration)) : null;
        if (run === 0) await page.screenshot({ path: path.join(output, `${target.label}-${routes.indexOf(route)}.png`), fullPage: true });
        const record = { target: target.label, run: run + 1, route, metrics, lcp: initial.lcp, longTasks: initial.longTasks, events, errors,
          overflow: initial.overflow, htmlBodyMarker: html.includes('PROFILE_FIXTURE_BODY_ONLY'),
          textHash: createHash('sha256').update(initial.visibleText).digest('hex'), metadata: initial.metadata, links: initial.links, images: initial.images,
          traffic: initialTraffic, resources: initial.resources.map(e => ({ ...e, name: e.name.replace(target.origin, '') })) };
        data.results.push(record);
        await writeFile(path.join(output, 'raw.json'), JSON.stringify(data, null, 2));
        console.log(JSON.stringify({ target: target.label, run: run + 1, route, metrics, errors }));
        await context.close();
      }
    }
  }
} finally { await browser.close(); }
const percentile = (values, p) => { const sorted = values.toSorted((a, b) => a - b); return sorted[Math.floor((sorted.length - 1) * p)]; };
const summary = { conditions: data.conditions, pages: {} };
for (const route of routes) {
  summary.pages[route] = {};
  for (const target of targets) {
    const records = data.results.filter(e => e.route === route && e.target === target.label);
    const metrics = {};
    for (const name of Object.keys(records[0].metrics)) {
      const values = records.map(e => e.metrics[name]).filter(e => typeof e === 'number');
      metrics[name] = values.length ? { median: percentile(values, .5), min: Math.min(...values), max: Math.max(...values), p25: percentile(values, .25), p75: percentile(values, .75), n: values.length } : { n: 0 };
    }
    summary.pages[route][target.label] = metrics;
  }
}
await writeFile(path.join(output, 'summary.json'), JSON.stringify(summary, null, 2));
