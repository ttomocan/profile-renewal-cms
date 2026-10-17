import { mkdtemp, mkdir, writeFile, symlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = process.cwd();
const fixture = await mkdtemp(path.join(os.tmpdir(), 'contact-ui-'));
const output = process.env.CONTACT_EVIDENCE_DIR || '/tmp/contact-ui-evidence';
await mkdir(output, { recursive: true });
await mkdir(path.join(fixture, 'app'), { recursive: true });
await symlink(path.join(root, 'node_modules'), path.join(fixture, 'node_modules'));
await symlink(path.join(root, 'public'), path.join(fixture, 'public'));
await writeFile(path.join(fixture, 'package.json'), JSON.stringify({ private: true }));
await writeFile(path.join(fixture, 'tsconfig.json'), JSON.stringify({ compilerOptions: {
  target: 'ES2022', jsx: 'preserve', module: 'esnext', moduleResolution: 'bundler',
  esModuleInterop: true, paths: { '@/*': [root + '/*'] },
}, include: ['**/*.ts', '**/*.tsx'] }));
// 実送信処理は読み込まず、クライアント内の非通信モックで状態だけを返す。
await writeFile(path.join(fixture, 'contact-mock.ts'), `
export async function createContactData(_state, formData) {
  await new Promise(resolve => setTimeout(resolve, 800));
  const scenario = formData.get('namae');
  if (scenario === '成功') return {status:'success', message:''};
  if (scenario === '一般エラー') return {status:'error', message:'検証用の送信エラーです。'};
  const field = scenario === '種別エラー' ? 'item' : 'email';
  return {status:'error', field, message:field === 'item' ? 'お問い合わせ項目を選択してください。' : 'メールアドレスの形式を確認してください。'};
}`);
await writeFile(path.join(fixture, 'next.config.mjs'), `export default {
  experimental:{externalDir:true}, devIndicators:false,
  webpack(c){c.resolve.alias={...c.resolve.alias,
    '@/app/_actions/contact$':${JSON.stringify(fixture + '/contact-mock.ts')},
    '@':${JSON.stringify(root)}};return c;}
};`);
await writeFile(path.join(fixture, 'app/layout.tsx'), `import '${root}/styles/common/style.scss';
export default function Layout({children}) {return <html lang="ja"><body><main>{children}</main></body></html>}`);
await writeFile(path.join(fixture, 'app/page.tsx'), `export {default} from '${root}/app/contact/page';`);
const logs = [];
const server = spawn(process.execPath, [root + '/node_modules/next/dist/bin/next', 'dev', '--webpack', '--hostname', '127.0.0.1', '--port', '3150'], {
  cwd: fixture, env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' }, stdio: ['ignore', 'pipe', 'pipe'],
});
server.stdout.on('data', value => logs.push(value.toString()));
server.stderr.on('data', value => logs.push(value.toString()));
let browser;
const checks = [];
try {
  for (let i = 0; i < 80; i++) {
    try { if ((await fetch('http://127.0.0.1:3150')).ok) break; } catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  browser = await chromium.launch({ executablePath: process.env.BROWSER_EXECUTABLE || '/usr/bin/chromium', args: ['--no-sandbox'] });
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  let blockedRequests = 0;
  await page.route('**/*', route => {
    const request = route.request();
    if (request.method() === 'POST' || new URL(request.url()).hostname !== '127.0.0.1') {
      blockedRequests++;
      return route.abort();
    }
    return route.continue();
  });
  for (const width of [320, 375, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('http://127.0.0.1:3150');
    await page.getByRole('radio').first().focus();
    await page.keyboard.press('Space');
    const dimensions = await page.locator('.checkbox-text').evaluateAll(elements => elements.map(element => {
      const box = element.getBoundingClientRect();
      const ring = getComputedStyle(element, '::before');
      const dot = getComputedStyle(element, '::after');
      return { left: box.left, height: box.height, ringWidth: parseFloat(ring.width), ringHeight: parseFloat(ring.height),
        centerX: parseFloat(ring.left) + parseFloat(ring.width) / 2,
        centerY: parseFloat(ring.top) + parseFloat(ring.height) / 2,
        dotX: parseFloat(dot.left) + parseFloat(dot.width) / 2, dotY: parseFloat(dot.top) };
    }));
    for (const item of dimensions) {
      assert.equal(item.ringWidth, 18); assert.equal(item.ringHeight, 18);
      assert.equal(item.centerX, item.dotX); assert.equal(item.centerY, item.dotY);
      assert.ok(item.height >= 44); assert.equal(item.left, dimensions[0].left);
    }
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.locator('fieldset').screenshot({ path: `${output}/radios-${width}.png` });
    checks.push({ width, dimensions });
  }
  await page.setViewportSize({ width: 640, height: 900 });
  await page.evaluate(() => { document.body.style.zoom = '2'; });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.evaluate(() => { document.body.style.zoom = '1'; });
  await page.locator('#namae').focus();
  const tabOrder = [];
  for (let i = 0; i < 6; i++) {
    tabOrder.push(await page.evaluate(() => document.activeElement.getAttribute('name') || document.activeElement.getAttribute('type')));
    await page.keyboard.press('Tab');
  }
  assert.deepEqual(tabOrder, ['namae', 'furigana', 'email', 'item', 'message', 'submit']);
  await page.getByRole('radio').first().focus(); await page.keyboard.press('ArrowRight');
  assert.equal(await page.getByRole('radio').nth(1).isChecked(), true);
  await page.getByRole('radio').first().focus(); await page.keyboard.press('Space');
  assert.equal(await page.getByRole('radio').first().isChecked(), true);
  const focus = [];
  for (const selector of ['#email', 'input[type=radio]', '[type=submit]']) {
    await page.locator(selector).first().focus();
    await page.waitForTimeout(100);
    focus.push(await page.locator(selector).first().evaluate(element => {
      const radio = element.matches('[type=radio]');
      const css = getComputedStyle(radio ? element.nextElementSibling : element, radio ? '::before' : null);
      return { color: css.outlineColor, width: css.outlineWidth, offset: css.outlineOffset };
    }));
  }
  assert.ok(focus.every(style => style.color === 'rgb(105, 48, 11)' && style.width === '3px'), JSON.stringify(focus));
  const submit = page.getByRole('button', { name: '送信する', exact: true });
  for (const [scenario, target] of [['メールエラー', '#email'], ['種別エラー', 'input[type=radio]'], ['一般エラー', '[type=submit]']]) {
    await page.locator('#namae').fill(scenario);
    await submit.click();
    await page.getByRole('button', { name: '送信中…', exact: true }).waitFor();
    assert.equal(await page.getByRole('button', { name: '送信中…', exact: true }).isDisabled(), true);
    assert.match(await page.getByRole('status').textContent(), /送信しています/);
    await page.locator('#contact-error').waitFor();
    await page.waitForFunction(selector => document.activeElement === document.querySelector(selector), target);
    assert.equal(await page.locator(target).first().getAttribute('aria-describedby'), 'contact-error');
    const alertId = await page.locator('#contact-error').getAttribute('id');
    assert.equal(alertId, 'contact-error');
  }
  await page.locator('#namae').fill('成功'); await submit.click();
  await page.locator('.p-form__success').waitFor();
  assert.equal(await page.locator('.p-form__success').evaluate(element => element === document.activeElement), true);
  assert.equal(await page.locator('.p-form__success').getAttribute('role'), 'status');
  assert.equal(await page.locator('form').count(), 0);
  assert.equal(blockedRequests, 0, 'モック実行で外部通信やPOSTを試みない');
  await writeFile(`${output}/checks.json`, JSON.stringify({ checks, tabOrder, focus, zoom: '200%相当・横はみ出しなし', states: ['pending', 'field-error', 'radio-error', 'general-error', 'success'], blockedRequests }, null, 2));
  console.log('フォーム5幅・200%相当・キーボード・模擬状態遷移の検証成功。外部送信なし。');
} finally {
  await browser?.close(); server.kill('SIGTERM');
  await writeFile(`${output}/server.log`, logs.join(''));
}
