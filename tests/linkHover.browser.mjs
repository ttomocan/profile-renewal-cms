import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as sass from 'sass';

const playwright = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browserName = process.env.TEST_BROWSER || 'chromium';
const css = [
  'styles/common/style.scss',
  'styles/pages/top.scss',
  'styles/pages/about.scss',
  'styles/pages/skill.scss',
  'styles/pages/result.scss',
].map(file => sass.compile(file, { logger: sass.Logger.silent }).css).join('\n')
  + '\n' + readFileSync('app/_components/WordPressWork/index.module.css', 'utf8')
  + '\n' + readFileSync('app/_components/Article/index.module.css', 'utf8');

// 実際のスタイルを使い、下線を持つ各導線と対象外のボタンを同じ画面で検証する。
const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8">
<style>${css}</style><style>
body{padding:24px;display:block}main{max-width:660px}section{margin:16px 0}
.p-top-hero__profile-link{background:#18110d}
.result-card__link{display:block}
</style></head><body class="about skill"><main>
<section class="links c-text-links">
<a id="wordpress" class="c-link-external" href="#destination" target="_blank" rel="noopener noreferrer">ともきゃんのボイトレ生活を見る</a>
<a id="blog" class="c-link-external" href="#destination">ブログデザインマニアを見る</a>
</section>
<section><a id="hero" class="p-top-hero__profile-link" href="#destination">プロフィール・経歴を見る</a></section>
<section class="about-related-links"><a id="about" class="c-text-link" href="#destination">関連する取り組みを見る</a></section>
<section><a id="skill" class="programming__related-link" href="#destination">関連する実績を見る</a></section>
<section class="result-related-links"><a id="result" href="#destination">関連ページを見る</a></section>
<section class="content c-text-links"><p><a id="article" href="#destination">折り返して表示する本文リンク。長いリンクでも文字と各行の下線が崩れず、下線だけがなめらかに消えることを確認します。</a></p></section>
<section class="p-form__agree"><a id="privacy" href="#destination">プライバシーポリシー</a></section>
<section><a id="utility" class="u-text-link" href="#destination">共通テキストリンク</a></section>
<section><a id="card" class="result-card__link" href="#destination"><span id="card-text" class="result-card__detail-text">この制作実績を見る</span></a></section>
<section><a id="button" class="c-button__link" href="#destination">ボタン</a></section>
<section class="tableOfContents"><a id="toc" href="#destination">目次リンク</a></section>
<div id="destination" tabindex="-1">移動先</div></main></body></html>`;

const browser = await playwright[browserName].launch(
  browserName === 'chromium' ? { channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true } : { headless: true },
);
const ids = ['wordpress', 'blog', 'hero', 'about', 'skill', 'result', 'article', 'privacy', 'utility', 'card-text'];
const checks = [];
const alpha = color => color.startsWith('rgba') ? Number(color.match(/,\s*([\d.]+)\)$/)[1]) : 1;
const style = locator => locator.evaluate(el => {
  const css = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  return { line: css.textDecorationLine, decoration: css.textDecorationColor, color: css.color,
    thickness: css.textDecorationThickness, outline: css.outlineStyle, outlineWidth: css.outlineWidth,
    transition: css.transition, width: rect.width, height: rect.height,
    iconColor: getComputedStyle(el, '::after').backgroundColor,
    iconMask: getComputedStyle(el, '::after').maskImage,
  };
});
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.setContent(html);
  for (const id of ids) {
    const target = page.locator('#' + id);
    const trigger = id === 'card-text' ? page.locator('#card') : target;
    await page.mouse.move(0, 0);
    await page.waitForTimeout(230);
    const before = await style(target);
    assert.equal(before.line, 'underline', id + ': 通常時の下線');
    await trigger.hover();
    const animation = await target.evaluateHandle(el => {
      const transition = el.getAnimations().find(animation => animation.transitionProperty === 'text-decoration-color');
      if (transition) transition.pause();
      return transition;
    });
    assert.equal(await animation.evaluate(animation => Boolean(animation)), true, id + ': 下線を消すトランジション');
    assert.equal(await animation.evaluate(animation => animation.effect.getTiming().duration), 200, id + ': 0.2秒');
    await animation.evaluate(animation => { animation.currentTime = 100; });
    const middle = await style(target);
    assert.ok(alpha(middle.decoration) > 0 && alpha(middle.decoration) < 1, id + ': 中間では下線だけ半透明');
    assert.equal(middle.line, 'underline', id + ': 線自体を瞬時に除去しない');
    await animation.evaluate(animation => { animation.currentTime = 200; });
    const after = await style(target);
    assert.equal(alpha(after.decoration), 0, id + ': 終点で下線が透明');
    assert.equal(after.thickness, before.thickness, id + ': 下線を太くしない');
    assert.equal(after.width, before.width, id + ': 幅が変わらない');
    assert.equal(after.height, before.height, id + ': 高さが変わらない');
    if (id === 'wordpress') {
      assert.equal(after.iconColor, after.color, '外部リンクアイコンは既存どおり文字色に連動する');

      assert.equal(after.iconMask, before.iconMask, '外部リンクアイコンを保持する');
    }
    await animation.evaluate(animation => animation.play());
    await page.mouse.move(0, 0);
    await page.waitForTimeout(250);
    assert.equal(alpha((await style(target)).decoration), 1, id + ': ホバー解除で下線が戻る');
    await trigger.hover();
    await page.mouse.move(0, 0);
    await trigger.hover();
    await page.waitForTimeout(250);
    assert.equal(alpha((await style(target)).decoration), 0, id + ': 繰り返しホバー');
    await page.mouse.move(0, 0);
    await page.waitForTimeout(250);
    await trigger.focus();
    const focused = await style(trigger);
    assert.notEqual(focused.outline, 'none', id + ': フォーカス枠');
    assert.equal(alpha((await style(target)).decoration), 1, id + ': キーボードフォーカスでは下線を保持');
    await trigger.hover();
    await page.waitForTimeout(250);
    assert.equal(alpha((await style(target)).decoration), 1, id + ': ホバーが重なってもキーボードフォーカス中は下線を保持');
    await trigger.evaluate(el => el.blur());
    checks.push(id);
  }
  for (const id of ['button', 'toc']) {
    const target = page.locator('#' + id);
    assert.equal((await style(target)).line, 'none', id + ': 元から下線のない導線は変更しない');
    await target.hover();
    assert.equal((await style(target)).line, 'none');
  }
  await page.setViewportSize({ width: 320, height: 740 });
  await page.mouse.move(0, 0);
  await page.waitForTimeout(250);
  assert.ok(await page.locator('#article').evaluate(el => el.getClientRects().length > 1), '長い本文リンクが複数行に折り返す');
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'スマートフォン幅で横スクロールしない');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('#wordpress').hover();
  await page.waitForTimeout(30);
  assert.equal(alpha((await style(page.locator('#wordpress'))).decoration), 0, '動きを減らす設定では直ちに切り替わる');
  assert.match((await style(page.locator('#wordpress'))).transition, /1e-05s|0.00001s/, '動きを減らす設定を尊重する');
  await page.close();
  if (browserName !== 'firefox') {
    const touch = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await touch.setContent(html);
    assert.equal(await touch.evaluate(() => matchMedia('(hover: hover)').matches), false);
    for (const id of ids) assert.equal(alpha((await style(touch.locator('#' + id))).decoration), 1, id + ': タッチ端末では下線を保持');
    await touch.close();
  }
  console.log(JSON.stringify({ browser: browserName, passed: checks, repeatedHover: true, keyboardFocus: true, mobileWrapping: true, reducedMotion: true }));
} finally {
  await browser.close();
}
