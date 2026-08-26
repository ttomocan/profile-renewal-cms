# Digital Agency Design System Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** TOMOCANの色・言葉・コンテンツを保ったまま、デジタル庁デザインシステムの原則を基準に、全ページの視認性、一貫性、操作性、アクセシビリティを改善する。

**Architecture:** Sassの共通トークンを唯一のデザイン契約とし、基礎スタイル、共通コンポーネント、ページ固有スタイルの順で置き換える。React側の変更はナビゲーション状態、スクロール表示、フォームの説明関連付けに限定し、microCMS、ルーティング、メタデータ、問い合わせServer Actionは変更しない。

**Tech Stack:** Next.js 16 App Router、React 19、TypeScript、Sass/CSS Modules、Node.js built-in test runner、microCMS

**Spec:** `docs/superpowers/specs/2026-08-26-digital-agency-design-system-refresh-design.md`

## Global Constraints

- TOMOCANのロゴ、主要コピー、掲載内容、ナビゲーション項目、URL、microCMSの取得処理、問い合わせ送信処理、SEO出力を維持する。
- 通常文字には `#f36b0a` を使わない。白文字を載せる主要操作面は `#b54708`、hoverは `#8f3500` を使う。
- 本文は16px/1.8、記事本文は17px/1.9かつ最大760px、標準コンテナは最大1120pxとする。
- 主要CTAは高さ48px以上、メニュー・ページネーション・アイコン操作は44px四方以上とする。
- カード化、角丸、影、グラデーション、アニメーションを装飾目的で増やさない。
- バブル、ローディング、波形は残す。スクロール表示はfadeと16–24px移動だけにし、`prefers-reduced-motion` では動きを止める。
- UI/runtime依存パッケージを追加しない。
- 各タスクで `npm run build:css` を実行した場合、生成済みの `styles/common/style.css` と `styles/common/style.css.map` も同じコミットに含める。

---

### Task 1: デザイントークンとUI契約テストを作る

**Files:**
- Create: `tests/uiDesignSystem.test.mjs`
- Modify: `package.json`
- Modify: `styles/global/_variables.scss`
- Modify: `styles/foundation/_base.scss`
- Modify: `styles/layout/_l-main.scss`
- Generated: `styles/common/style.css`
- Generated: `styles/common/style.css.map`

**Produces:** 後続タスクが使用するSass変数、CSSカスタムプロパティ、基礎タイポグラフィ、コンテナ、フォーカス、reduced-motionの契約。

- [ ] **Step 1: Node test runnerを登録する**

`package.json` の `scripts` に次を追加する。

```json
"test": "node --test tests/*.test.mjs"
```

- [ ] **Step 2: 失敗する基礎契約テストを書く**

`tests/uiDesignSystem.test.mjs` を次の骨格で作る。

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = (relativePath) => readFile(`${root}${relativePath}`, 'utf8');

test('semantic design tokens are defined once', async () => {
  const variables = await read('styles/global/_variables.scss');
  for (const declaration of [
    '$brandAccent: #f36b0a;',
    '$brandStrong: #b54708;',
    '$brandStrongHover: #8f3500;',
    '$textC: #282828;',
    '$textSecondaryC: #666666;',
    '$baseC: #fcf6f1;',
    '$surfaceC: #ffffff;',
    '$borderC: #d8cec7;',
    '$focusC: #0066cc;',
    '$errorC: #b3261e;',
    '$inner: 1120px;',
    '$innerSmall: 760px;',
  ]) {
    assert.ok(variables.includes(declaration), `missing ${declaration}`);
  }
  assert.match(variables, /--color-brand-strong:\s*#b54708/);
  assert.match(variables, /--space-24:\s*24px/);
  assert.match(variables, /--radius-standard:\s*10px/);
});

test('base typography, focus, containers and reduced motion use the shared contract', async () => {
  const [base, main, variables] = await Promise.all([
    read('styles/foundation/_base.scss'),
    read('styles/layout/_l-main.scss'),
    read('styles/global/_variables.scss'),
  ]);
  assert.match(base, /font-size:\s*16px/);
  assert.match(base, /line-height:\s*1\.8/);
  assert.match(base, /outline:\s*3px solid \$focusC/);
  assert.match(base, /prefers-reduced-motion:\s*reduce/);
  assert.match(base, /max-width:\s*calc\(#\{\$inner\}/);
  assert.match(base, /max-width:\s*calc\(#\{\$innerSmall\}/);
  assert.match(main, /\$sectionSpacePc/);
  assert.match(main, /\$sectionSpaceSp/);
  assert.match(variables, /\$sectionSpacePc:\s*96px/);
  assert.match(variables, /\$sectionSpaceSp:\s*64px/);
});
```

- [ ] **Step 3: テストが意図どおり失敗することを確認する**

Run: `node --test --test-name-pattern="semantic design tokens|base typography" tests/uiDesignSystem.test.mjs`

Expected: FAIL。`$brandStrong`、16px本文、1120pxコンテナのいずれかが未定義と表示される。

- [ ] **Step 4: SassとCSSの共通トークンを定義する**

`styles/global/_variables.scss` の既存値を次の体系へ置き換える。互換名 `$mainC` と `$linkC` は既存SCSSの段階移行に使う。

```scss
$brandAccent: #f36b0a;
$brandStrong: #b54708;
$brandStrongHover: #8f3500;
$textC: #282828;
$textSecondaryC: #666666;
$baseC: #fcf6f1;
$subtleC: #f5ede7;
$surfaceC: #ffffff;
$borderC: #d8cec7;
$focusC: #0066cc;
$errorC: #b3261e;
$mainC: $brandAccent;
$linkC: $brandStrong;

$inner: 1120px;
$innerSmall: 760px;
$space-1: 4px;
$space-2: 8px;
$space-3: 12px;
$space-4: 16px;
$space-6: 24px;
$space-8: 32px;
$space-12: 48px;
$space-16: 64px;
$space-20: 80px;
$space-24: 96px;
$sectionSpacePc: 96px;
$sectionSpaceSp: 64px;
$radiusSmall: 6px;
$radiusStandard: 10px;
$radiusLarge: 16px;

:root {
  --color-brand-accent: #{$brandAccent};
  --color-brand-strong: #{$brandStrong};
  --color-brand-strong-hover: #{$brandStrongHover};
  --color-text: #{$textC};
  --color-text-secondary: #{$textSecondaryC};
  --color-background: #{$baseC};
  --color-background-subtle: #{$subtleC};
  --color-surface: #{$surfaceC};
  --color-border: #{$borderC};
  --color-focus: #{$focusC};
  --color-error: #{$errorC};
  --space-4: #{$space-1};
  --space-8: #{$space-2};
  --space-12: #{$space-3};
  --space-16: #{$space-4};
  --space-24: #{$space-6};
  --space-32: #{$space-8};
  --space-48: #{$space-12};
  --space-64: #{$space-16};
  --space-80: #{$space-20};
  --space-96: #{$space-24};
  --radius-small: #{$radiusSmall};
  --radius-standard: #{$radiusStandard};
  --radius-large: #{$radiusLarge};
  --content-width: #{$inner};
  --reading-width: #{$innerSmall};
}
```

- [ ] **Step 5: 基礎タイポグラフィ、フォーカス、コンテナを実装する**

`styles/foundation/_base.scss` と `styles/layout/_l-main.scss` の該当宣言を次の値に揃える。

```scss
body {
  color: $textC;
  background-color: $baseC;
  font-size: 16px;
  line-height: 1.8;
}

:where(a, button, input, textarea, select, summary):focus-visible {
  outline: 3px solid $focusC;
  outline-offset: 3px;
}

.inner {
  width: 100%;
  max-width: calc(#{$inner} + 48px);
  margin-inline: auto;
  padding-inline: 24px;
}

.inner-s {
  max-width: calc(#{$innerSmall} + 48px);
}
```

SPでは `.inner` の左右paddingを16pxにし、`.inner-s` の最大幅加算も32pxにする。`_l-main.scss` のセクション余白をPC `$sectionSpacePc`、SP `$sectionSpaceSp` にする。既存の `prefers-reduced-motion` ブロックは保持し、`scroll-behavior: auto` とanimation/transition停止を含める。

- [ ] **Step 6: コンパイルとテストを通す**

Run: `npm run build:css`

Expected: exit 0。`styles/common/style.css` とmapが更新される。

Run: `npm test`

Expected: PASS。

- [ ] **Step 7: 基盤をコミットする**

```powershell
git add package.json tests/uiDesignSystem.test.mjs styles/global/_variables.scss styles/foundation/_base.scss styles/layout/_l-main.scss styles/common/style.css styles/common/style.css.map
git commit -m "style: add shared accessible design tokens"
```

---

### Task 2: ヘッダー、フッター、見出し、ボタン、リンクを統一する

**Files:**
- Modify: `app/_components/Header/index.tsx`
- Modify: `app/_components/MenuNav/index.tsx`
- Modify: `app/_components/Footer/index.tsx`
- Modify: `styles/global/_mixin.scss`
- Modify: `styles/layout/_l-header.scss`
- Modify: `styles/layout/_l-footer.scss`
- Modify: `styles/object/component/_heading.scss`
- Modify: `styles/object/component/_button.scss`
- Modify: `styles/object/component/_link.scss`
- Modify: `styles/object/component/_pagenation.scss`
- Modify: `styles/object/component/_pagetop.scss`
- Modify: `styles/object/component/_list.scss`
- Modify: `styles/object/component/_table.scss`
- Modify: `tests/uiDesignSystem.test.mjs`
- Generated: `styles/common/style.css`
- Generated: `styles/common/style.css.map`

**Consumes:** Task 1の色、余白、角丸、フォーカストークン。

- [ ] **Step 1: 失敗するナビゲーション・操作サイズテストを追記する**

```js
test('navigation exposes current state and shared controls meet target sizes', async () => {
  const [menu, footer, headerScss, buttonScss, paginationScss, mixin] = await Promise.all([
    read('app/_components/MenuNav/index.tsx'),
    read('app/_components/Footer/index.tsx'),
    read('styles/layout/_l-header.scss'),
    read('styles/object/component/_button.scss'),
    read('styles/object/component/_pagenation.scss'),
    read('styles/global/_mixin.scss'),
  ]);
  assert.match(menu, /aria-current=/);
  assert.match(footer, /aria-current=/);
  assert.match(headerScss, /min-(?:width|inline-size):\s*44px/);
  assert.match(headerScss, /min-(?:height|block-size):\s*44px/);
  assert.match(mixin, /min-(?:height|block-size):\s*48px/);
  assert.match(buttonScss, /\$brandStrong/);
  assert.match(paginationScss, /min-(?:width|inline-size):\s*44px/);
});
```

Run: `node --test --test-name-pattern="navigation exposes" tests/uiDesignSystem.test.mjs`

Expected: FAIL。`aria-current` と最小操作サイズが不足している。

- [ ] **Step 2: 現在地とメニューのキーボード復帰を実装する**

`MenuNavLink` に `current?: boolean` を追加し、`className` を分離して内部の `Link` に次を渡す。

```tsx
aria-current={current ? 'page' : undefined}
className={`${className ?? ''}${current ? ' current' : ''}`.trim()}
```

各内部リンクは `current={isCurrent('/about')}` のように指定する。Footerでも同じpathname判定結果を `aria-current={isCurrent('/about') ? 'page' : undefined}` に渡す。

`Header/index.tsx` はメニューボタンのrefを保持し、Escapeで閉じたときにフォーカスを戻す。

```tsx
const menuButtonRef = useRef<HTMLButtonElement>(null);

const closeMenu = useCallback((restoreFocus = false) => {
  setIsMenuOpen(false);
  if (restoreFocus) {
    requestAnimationFrame(() => menuButtonRef.current?.focus());
  }
}, []);
```

Escapeハンドラは `closeMenu(true)`、リンククリックとpathname変更は `closeMenu(false)` を呼ぶ。buttonへ `ref={menuButtonRef}` を追加し、既存の `aria-label`、`aria-expanded`、`aria-controls` は維持する。

- [ ] **Step 3: 共通操作面の見た目をトークンへ揃える**

主要ボタンの基準を次にする。

```scss
@mixin btn(
  $bg,
  $color,
  $width,
  $border: $bg,
  $hoverBg: $brandStrongHover,
  $hoverColor: $color
) {
  display: inline-flex;
  min-width: $width;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  padding: $space-3 $space-6;
  border: 1px solid $border;
  border-radius: $radiusStandard;
  color: $color;
  background: $bg;

  &:hover {
    color: $hoverColor;
    background: $hoverBg;
    transform: translateY(-2px);
  }
}

.c-button__link {
  @include btn($brandStrong, #fff, 280px);
  font-weight: 700;
  line-height: 1.4;
  text-decoration: none;
}
```

secondaryは白背景・`$brandStrong` 文字・1px境界線にする。見出しはH1 `clamp(2rem, 5vw, 3rem)`、H2 `clamp(1.75rem, 4vw, 2.25rem)`、H3 `clamp(1.25rem, 3vw, 1.5rem)` に揃える。本文リンクは `$brandStrong` と常時下線を基本にし、ナビゲーションとボタンのみ下線対象外にする。

HeaderはPC最大88px、SP64px、メニューボタン44px四方、選択中リンクは文字色・下線・太さで示す。Footerは情報グループを境界線と余白で区切り、カードや大きな影を追加しない。ページネーションとページトップ操作は44px四方以上にする。

```scss
.l-header {
  min-height: 88px;
}

.l-header__menuBtn-button {
  min-width: 44px;
  min-height: 44px;
}

@include mq(spHeader) {
  .l-header {
    min-height: 64px;
  }
}

.c-navigation-link[aria-current='page'] {
  color: $brandStrong;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 0.35em;
}
```

- [ ] **Step 4: コンパイルと回帰テストを通す**

Run: `npm run build:css`

Run: `npm test`

Run: `npm run typecheck`

Expected: すべてexit 0。

- [ ] **Step 5: 共通コンポーネントをコミットする**

```powershell
git add app/_components/Header/index.tsx app/_components/MenuNav/index.tsx app/_components/Footer/index.tsx styles/global/_mixin.scss styles/layout styles/object/component tests/uiDesignSystem.test.mjs styles/common/style.css styles/common/style.css.map
git commit -m "style: unify navigation and shared controls"
```

---

### Task 3: スクロール表示とページタイトルの動きを整理する

**Files:**
- Create: `app/_components/ScrollRevealProvider/index.tsx`
- Modify: `app/DynamicBodyClass.tsx`
- Modify: `app/layout.tsx`
- Modify: `styles/common/animation.scss`
- Modify: `styles/layout/_l-pagetitle.scss`
- Modify: `tests/uiDesignSystem.test.mjs`
- Generated: `styles/common/animation.css`
- Generated: `styles/common/animation.css.map`
- Generated: `styles/common/style.css`
- Generated: `styles/common/style.css.map`

**Consumes:** 既存ページに付いている `.fadeUpTrigger`。BubblyBackground、WaveAnimation、Loadingの責務は変更しない。

- [ ] **Step 1: 失敗するmotion契約テストを追記する**

```js
test('scroll reveal has one motion pattern and respects reduced motion', async () => {
  const [provider, animation, dynamicBody, layout] = await Promise.all([
    read('app/_components/ScrollRevealProvider/index.tsx').catch(() => ''),
    read('styles/common/animation.scss'),
    read('app/DynamicBodyClass.tsx'),
    read('app/layout.tsx'),
  ]);
  assert.match(provider, /IntersectionObserver/);
  assert.match(provider, /prefers-reduced-motion:\s*reduce/);
  assert.match(provider, /\.fadeUpTrigger/);
  assert.doesNotMatch(dynamicBody, /flipLeft|flipRight|rotateX|zoomOut/);
  assert.doesNotMatch(layout, /flipLeftTrigger|rotateXTrigger|zoomOutTrigger/);
  assert.match(animation, /translateY\(24px\)/);
  assert.doesNotMatch(animation, /translateY\((?:8[0-9]|[1-9][0-9]{2,})px\)/);
});
```

Run: `node --test --test-name-pattern="scroll reveal" tests/uiDesignSystem.test.mjs`

Expected: FAIL。Providerが未作成で複数motion名が残っている。

- [ ] **Step 2: スクロール表示を独立Providerへ移す**

`app/_components/ScrollRevealProvider/index.tsx` を作る。

```tsx
'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ScrollRevealProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('.fadeUpTrigger'),
    );
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reduceMotion) {
      elements.forEach((element) => element.classList.add('fadeUp'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('fadeUp');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
```

`app/layout.tsx` で `DynamicBodyClass` の隣にProviderを置く。noscriptの強制表示セレクタは `.fadeUpTrigger` のみにする。`app/DynamicBodyClass.tsx` からanimation type配列、scroll判定、クラス付与を削除し、pathnameに応じたbody classと既存の属性cleanupだけを残す。

- [ ] **Step 3: animation.scssとPageTitleを短いfadeへ揃える**

```scss
.fadeUpTrigger {
  opacity: 0;
  transform: translateY(24px);
}

.fadeUp {
  animation: fade-up 320ms ease-out forwards;
}

@keyframes fade-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .fadeUpTrigger,
  .fadeUp {
    opacity: 1;
    transform: none;
    animation: none;
  }
}
```

PageTitleは既存の大きな移動・反転を削除し、`opacity` と最大16pxのY移動を300msで表示する。バブル数・速度、WaveAnimation、Loadingの最大500ms条件は変更しない。

- [ ] **Step 4: motion生成物とテストを確認する**

Run: `npm run build:css`

Run: `npm test`

Run: `npm run typecheck`

Expected: すべてexit 0。

- [ ] **Step 5: motion整理をコミットする**

```powershell
git add app/_components/ScrollRevealProvider app/DynamicBodyClass.tsx app/layout.tsx styles/common/animation.scss styles/common/animation.css styles/common/animation.css.map styles/layout/_l-pagetitle.scss styles/common/style.css styles/common/style.css.map tests/uiDesignSystem.test.mjs
git commit -m "refactor: simplify accessible reveal motion"
```

---

### Task 4: Top・About・Skillを共通レイアウトへ揃える

**Files:**
- Modify: `styles/pages/top.scss`
- Modify: `styles/pages/about.scss`
- Modify: `styles/pages/skill.scss`
- Modify: `tests/uiDesignSystem.test.mjs`

**Preserves:** ヒーローのコピー、プロフィール、スキル一覧、CTAリンク、バブル背景、波形。

- [ ] **Step 1: 失敗するページ構成テストを追記する**

```js
test('top about and skill pages use shared spacing and surface tokens', async () => {
  const [top, about, skill] = await Promise.all([
    read('styles/pages/top.scss'),
    read('styles/pages/about.scss'),
    read('styles/pages/skill.scss'),
  ]);
  assert.match(top, /\$sectionSpacePc/);
  assert.match(top, /\$brandStrong/);
  assert.match(about, /\$innerSmall/);
  assert.match(about, /\$borderC/);
  assert.match(skill, /\$surfaceC/);
  assert.match(skill, /\$radiusStandard/);
});
```

Run: `node --test --test-name-pattern="top about and skill" tests/uiDesignSystem.test.mjs`

Expected: FAIL。各ページに共通トークンが反映されていない。

- [ ] **Step 2: Topページの情報階層を整理する**

`top.scss` は既存セレクタとDOM順を保ち、次の規則で置き換える。

```scss
.p-top-facts,
.p-top-about,
.p-top-skill,
.p-top-results,
.p-top-diary,
.p-top-contact {
  padding-block: $sectionSpacePc;

  @include mq(sp) {
    padding-block: $sectionSpaceSp;
  }
}

.p-top-hero__text-content {
  max-width: $innerSmall;
  color: $textSecondaryC;
  font-size: 1rem;
  line-height: 1.8;
}

.p-top-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: $space-4;
  margin-top: $space-8;
}
```

この規則を既存の `.p-top-hero`、`.p-top-facts`、`.p-top-about`、`.p-top-skill`、`.p-top-results`、`.p-top-diary`、`.p-top-contact` に適用する。主要CTAは `$brandStrong`、補助CTAは白背景に境界線、カードは白背景・1px境界線・`$radiusStandard`・`box-shadow: none` にする。hover移動は最大2pxとし、グラデーションによる階層表現を削除する。

- [ ] **Step 3: AboutとSkillを読み物・一覧の型へ揃える**

About本文は最大760px、段落間24px、セクション間64–96px、引用や補足だけを薄い背景と左境界線で示す。Skill一覧はPC2列、SP1列を保ち、カード内部を「カテゴリ名→説明→項目」の順で視線移動できる余白にする。

```scss
.about .about-section-copy {
  max-width: $innerSmall;
  margin-inline: auto;
}

.skill .programming__item,
.skill .framework__item,
.skill .tool__item,
.skill .ai-tool__item {
  padding: $space-6;
  border: 1px solid $borderC;
  border-radius: $radiusStandard;
  background: $surfaceC;
  box-shadow: none;
}
```

- [ ] **Step 4: コンパイル、テスト、型検査を通す**

Run: `npx sass --no-source-map styles/pages/top.scss NUL`

Run: `npx sass --no-source-map styles/pages/about.scss NUL`

Run: `npx sass --no-source-map styles/pages/skill.scss NUL`

Run: `npm test`

Run: `npm run typecheck`

Expected: すべてexit 0。

- [ ] **Step 5: 主要3ページをコミットする**

```powershell
git add styles/pages/top.scss styles/pages/about.scss styles/pages/skill.scss tests/uiDesignSystem.test.mjs
git commit -m "style: refresh primary portfolio pages"
```

---

### Task 5: 制作実績一覧・詳細を比較しやすくする

**Files:**
- Modify: `styles/pages/result.scss`
- Modify: `components/ResultCard.tsx`
- Modify: `components/Pagination.tsx`
- Modify: `app/result/_components/ResultArchive.tsx`
- Modify: `tests/uiDesignSystem.test.mjs`

**Preserves:** microCMS取得、一覧と詳細URL、画像、担当範囲、技術、説明、ページネーションロジック、メタデータ。

- [ ] **Step 1: 失敗する実績UI契約テストを追記する**

```js
test('result cards and pagination expose restrained surfaces and 44px targets', async () => {
  const [result, archive, pagination] = await Promise.all([
    read('styles/pages/result.scss'),
    read('app/result/_components/ResultArchive.tsx'),
    read('components/Pagination.tsx'),
  ]);
  assert.match(result, /\$borderC/);
  assert.match(result, /\$radiusStandard/);
  assert.match(result, /min-(?:width|inline-size):\s*44px/);
  assert.doesNotMatch(result, /[🕒📝]/u);
  assert.doesNotMatch(archive, /📝/u);
  assert.match(pagination, /aria-current="page"/);
});
```

Run: `node --test --test-name-pattern="result cards" tests/uiDesignSystem.test.mjs`

Expected: FAIL。カード境界線、44px操作面、emoji空状態の契約を満たさない。

- [ ] **Step 2: カードの情報順を視覚的に固定する**

`ResultCard.tsx` のDOM順「画像→種別→日付等のmeta→タイトル→担当範囲→技術→概要→詳細リンク」は維持する。`<div className="result-card__overlay" />` を削除し、`.result-card__action-icon` は常時表示の白背景・濃いブランド色・30pxアイコンとして残す。`result.scss` は次の表面へ揃える。

```scss
.result-card {
  overflow: hidden;
  border: 1px solid $borderC;
  border-radius: $radiusStandard;
  background: $surfaceC;
  box-shadow: 0 2px 8px rgb(40 40 40 / 8%);
}

.result-card__content {
  display: grid;
  gap: $space-4;
  padding: $space-6;
}

.result-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgb(40 40 40 / 10%);
}
```

- [ ] **Step 3: 詳細記事、ページネーション、空状態を整理する**

詳細本文は最大760px、概要ブロックだけを `$subtleC` と左境界線で強調し、その他のセクションは余白と見出しで分ける。ページネーションは各操作を44px四方以上にし、currentは `$brandStrong` の下線・太字・境界線で示す。`.result-card__meta-date::before` と `.result-detail__header .badge--period::before` の時計emojiを削除する。空状態のemojiも削除し、「制作実績は準備中です」のテキストと戻り導線だけを中央配置する。

```scss
.results-pagination__item {
  min-width: 44px;
  min-height: 44px;
}

.result-detail__section {
  max-width: $innerSmall;
  margin-inline: auto;
  font-size: 17px;
  line-height: 1.9;
}
```

- [ ] **Step 4: コンパイルと回帰検査を通す**

Run: `npx sass --no-source-map styles/pages/result.scss NUL`

Run: `npm test`

Run: `npm run typecheck`

Expected: すべてexit 0。

- [ ] **Step 5: 実績ページをコミットする**

```powershell
git add styles/pages/result.scss components/ResultCard.tsx components/Pagination.tsx app/result/_components/ResultArchive.tsx tests/uiDesignSystem.test.mjs
git commit -m "style: clarify portfolio result browsing"
```

---

### Task 6: Diary一覧・記事・検索・カテゴリを読みやすくする

**Files:**
- Modify: `app/_components/DiaryList/index.module.css`
- Modify: `app/_components/Article/index.module.css`
- Modify: `app/_components/Pagination/index.module.css`
- Modify: `app/_components/Breadcrumb/index.module.css`
- Modify: `app/_components/SearchField/index.module.css`
- Modify: `app/_components/CategoryFilter/index.module.css`
- Modify: `app/_components/Date/index.module.css`
- Modify: `app/_components/Category/index.module.css`
- Modify: `app/_components/DiaryListSkeleton/index.module.css`
- Modify: `app/diary/page.module.css`
- Modify: `app/diary/search/page.module.css`
- Modify: `app/diary/category/[id]/page.module.css`
- Modify: `app/diary/[slug]/page.module.css`
- Modify: `app/diary/globals.css`
- Modify: `tests/uiDesignSystem.test.mjs`

**Preserves:** microCMS query、検索、カテゴリ絞り込み、ページ番号、記事HTML、canonical、OGP、JSON-LD。

- [ ] **Step 1: 失敗するDiary契約テストを追記する**

```js
test('diary uses readable article width and accessible search controls', async () => {
  const [article, pagination, search, breadcrumb] = await Promise.all([
    read('app/_components/Article/index.module.css'),
    read('app/_components/Pagination/index.module.css'),
    read('app/_components/SearchField/index.module.css'),
    read('app/_components/Breadcrumb/index.module.css'),
  ]);
  assert.match(article, /max-width:\s*(?:760px|var\(--reading-width\))/);
  assert.match(article, /font-size:\s*17px/);
  assert.match(article, /line-height:\s*1\.9/);
  assert.match(pagination, /min-(?:width|inline-size):\s*44px/);
  assert.match(pagination, /min-(?:height|block-size):\s*44px/);
  assert.match(search, /var\(--color-brand-strong\)/);
  assert.doesNotMatch(breadcrumb, /animation-delay/);
});
```

Run: `node --test --test-name-pattern="diary uses readable" tests/uiDesignSystem.test.mjs`

Expected: FAIL。記事幅、文字サイズ、操作面、breadcrumb motionが旧値のまま。

- [ ] **Step 2: 一覧、検索、カテゴリを共通トークンへ移す**

CSS ModulesではTask 1のCSSカスタムプロパティを使う。検索buttonは濃いブランド色、inputは1px境界線、両方48px以上にする。

```css
.searchInput,
.submitButton {
  min-height: 48px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-standard);
}

.submitButton {
  color: #fff;
  background: var(--color-brand-strong);
}

.submitButton:hover {
  background: var(--color-brand-strong-hover);
}
```

Diaryカードは白背景、1px境界線、標準角丸、最大2px hover移動とする。カテゴリは形・境界線・文字を併用し、色だけで区別しない。Breadcrumbは横スクロール可能、currentは通常文字、区切りは `aria-hidden` の既存実装を保ち、個別のanimation-delayを削除する。

- [ ] **Step 3: 記事本文とページネーションを読み物の型へ揃える**

```css
.content {
  width: min(100% - 32px, var(--reading-width));
  margin-inline: auto;
  color: var(--color-text);
  font-size: 17px;
  line-height: 1.9;
}

.content a {
  color: var(--color-brand-strong);
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.item,
.link {
  min-width: 44px;
  min-height: 44px;
}
```

本文中のh2/h3、引用、code、画像captionは、角丸カードへ包まず余白・境界線・背景色で区別する。Skeletonは実コンテンツと同じ寸法を維持し、reduced-motion時はpulseを停止する。

- [ ] **Step 4: Diaryのテストと型検査を通す**

Run: `npm test`

Run: `npm run typecheck`

Run: `npm run lint`

Expected: すべてexit 0。

- [ ] **Step 5: Diary UIをコミットする**

```powershell
git add app/_components/DiaryList/index.module.css app/_components/Article/index.module.css app/_components/Pagination/index.module.css app/_components/Breadcrumb/index.module.css app/_components/SearchField/index.module.css app/_components/CategoryFilter/index.module.css app/_components/Date/index.module.css app/_components/Category/index.module.css app/_components/DiaryListSkeleton/index.module.css app/diary tests/uiDesignSystem.test.mjs
git commit -m "style: improve diary reading and discovery"
```

---

### Task 7: Contact・404・エラー表示を同じ操作基準へ揃える

**Files:**
- Modify: `app/_components/ContactForm/index.tsx`
- Modify: `styles/object/project/_form.scss`
- Modify: `app/not-found.module.css`
- Modify: `app/not-found.tsx`
- Modify: `tests/uiDesignSystem.test.mjs`
- Generated: `styles/common/style.css`
- Generated: `styles/common/style.css.map`

**Preserves:** 問い合わせServer Action、validation条件、送信中表示、成功遷移、404の戻り先。

- [ ] **Step 1: 失敗するフォーム・状態画面テストを追記する**

```js
test('contact errors are associated and form controls keep accessible dimensions', async () => {
  const [form, formScss, notFound] = await Promise.all([
    read('app/_components/ContactForm/index.tsx'),
    read('styles/object/project/_form.scss'),
    read('app/not-found.module.css'),
  ]);
  assert.match(form, /aria-describedby=/);
  assert.match(form, /id="contact-error"/);
  assert.match(formScss, /\$errorC/);
  assert.match(formScss, /min-height:\s*44px/);
  assert.match(notFound, /var\(--reading-width\)/);
  assert.match(notFound, /var\(--color-brand-strong\)/);
});
```

Run: `node --test --test-name-pattern="contact errors" tests/uiDesignSystem.test.mjs`

Expected: FAIL。エラー説明の関連付けと共通トークンが不足している。

- [ ] **Step 2: validation summaryを各fieldと関連付ける**

`ContactForm/index.tsx` にhelperを追加する。

```tsx
import { createContactData, type ContactField, type ContactFormState } from '@/app/_actions/contact';

const getErrorDescription = (field: ContactField) =>
  hasFieldError(field) ? 'contact-error' : undefined;
```

各input、textarea、radio groupへ `aria-describedby={getErrorDescription('namae')}` のように対応fieldを渡す。既存の `aria-invalid`、`role="alert"`、最初のinvalid fieldへのfocus、送信中disabledは維持する。radio fieldsetは `aria-describedby` をfieldsetに付ける。

- [ ] **Step 3: 入力、エラー、404を共通表現へ揃える**

```scss
.p-form .textfield,
.p-form .textarea,
.p-form select {
  min-height: 48px;
  border: 1px solid $borderC;
  border-radius: $radiusSmall;
  background: $surfaceC;
}

.p-form input[type='radio'] + .checkbox-text {
  min-height: 44px;
}

.p-form .textfield[aria-invalid='true'],
.p-form .textarea[aria-invalid='true'],
.p-form fieldset[aria-invalid='true'] {
  border-color: $errorC;
}

.p-form__error {
  color: $errorC;
  border-left: 4px solid $errorC;
  background: color-mix(in srgb, $errorC 8%, #fff);
}

.container {
  width: min(100% - 32px, var(--reading-width));
  margin-inline: auto;
}

.container :global(.c-button__link) {
  background: var(--color-brand-strong);
}
```

404は最大760px、説明、主要導線の順で配置し、主要導線は濃いブランド色を使う。装飾用emoji、巨大な影、グラデーションは追加しない。

- [ ] **Step 4: コンパイル、テスト、型検査を通す**

Run: `npm run build:css`

Run: `npm test`

Run: `npm run typecheck`

Expected: すべてexit 0。

- [ ] **Step 5: フォームと状態画面をコミットする**

```powershell
git add app/_components/ContactForm/index.tsx styles/object/project/_form.scss app/not-found.module.css app/not-found.tsx tests/uiDesignSystem.test.mjs styles/common/style.css styles/common/style.css.map
git commit -m "style: align forms and state pages"
```

---

### Task 8: 全ページのビルド・PC/SP・キーボード・SEOを検証する

**Files:**
- Verify: `tests/uiDesignSystem.test.mjs`
- Verify: `.next/server/app/**`
- Verify in browser: `/`, `/about`, `/skill`, `/result`, 実績詳細1件, `/diary`, Diary記事1件, Diary検索結果, Diaryカテゴリ結果, `/contact`, 存在しないURL

**Acceptance boundary:** このタスクでは新機能を追加しない。検証で差分が必要になった場合は、該当するTask 1–7のファイルだけを修正し、そのタスクの検査を再実行する。

- [ ] **Step 1: 自動検査を順に実行する**

Run: `npm test`

Expected: 全UI契約テストPASS。

Run: `npm run build:css`

Expected: exit 0、生成CSSに未反映差分なし。

Run: `npm run lint`

Expected: exit 0。

Run: `npm run typecheck`

Expected: exit 0。

Run: `npm run build`

Expected: exit 0、全route生成完了。microCMS接続がsandbox制限で失敗した場合は同じコマンドをネットワーク許可付きで再実行し、最初のblocking errorと最終exit codeを記録する。

- [ ] **Step 2: PC 1280×900で主要導線を確認する**

Run: `npm run dev`

ブラウザを1280×900にし、対象routeで以下を確認する。

- Headerが88px以内で、現在地が文字・太さ・下線で分かる。
- 本文コンテナが1120px、読み物が760px以内で、左右24px以上の余白がある。
- CTAは48px以上、ページネーション・メニュー操作は44px以上。
- Top/About/Skill/Result/Diary/Contact/404で背景、境界線、角丸、見出し階層が一貫する。
- リンク、ボタン、入力、カードのhover移動が2px以内で、コンテンツが揺れない。

- [ ] **Step 3: SP 390×844と200% zoomを確認する**

390×844で横スクロールがなく、Headerが64px以内、左右余白16px、1カラム、タップ対象44px以上であることを確認する。PC幅へ戻して200% zoomにし、メニュー、フォーム、カード、breadcrumbが重ならず、操作と文章が欠けないことを確認する。

- [ ] **Step 4: キーボードとreduced motionを確認する**

Tabのみでskip link、header、main、footer、フォーム、ページネーションを順に移動する。フォーカスリングが青で常に見え、Escapeでメニューが閉じてボタンにフォーカスが戻ることを確認する。OSまたはDevToolsでreduced motionを有効にし、スクロール表示、PageTitle、Skeletonが即時表示、バブルと波形が静止表示、Loadingが内容を妨げないことを確認する。

- [ ] **Step 5: SEO出力とルート契約を確認する**

ブラウザで各routeのrendered headを確認し、`.next/server/app/**` の生成HTML・RSC出力も検索する。既存のtitle、description、canonical、robots、OGP、JSON-LD、Diary/Resultのページ番号URLが変更されていないことを確認する。`git diff` でmicroCMS client、query、Server Action、route segment、metadata生成ファイルに意図しない差分がないことを確認する。

- [ ] **Step 6: 最終状態を確認する**

Run: `git status --short`

Expected: 検証修正をコミット済みで空。修正が発生した場合は該当タスク名に沿ったコミットを作り、`npm test && npm run lint && npm run typecheck && npm run build` を再実行する。空コミットは作らない。
