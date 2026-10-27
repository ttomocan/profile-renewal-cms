# マークアップ・アクセシビリティ修正のローカル検証

対象は `ttomocan/profile-renewal-cms` のみ。基準 main は `2ac1894b5379ecce9d1ebbc3688fd8f17dd87de1`。独立 worktree `/workspace/profile-renewal-cms-a11y-20261027` の `fix/markup-accessibility-20261027` で作業した。

開始時・最終確認時ともリモート main は同じ SHA。`fix/seo-cms-contact-20261026` は `279e3827622832889e1ff41570959a225f0d065a`、main より2コミット先で、開いている PR は0件だった。別枝の CMS エラー判定・GA4／問い合わせ計測修正は取り込んでいない。元 checkout の `work` は変更なし。

## 変更

- フッター背景 `#f36b0a` と配置を維持し、文字・下線・フォーカス枠を `#282828` へ変更。通常文字は約3.035:1から4.857:1、フォーカス枠も3:1以上。
- 日記カテゴリーの選択直後の遷移を廃止。「表示する」のフォーム送信で既存カテゴリー URL へ遷移する。選択変更はその場で保持する。JS 無効時は既存の `/diary/?category=…` に GET 送信し、「すべて」は空値で復帰する。カテゴリーの prop が変わった場合はフォームを再生成して選択を同期する。
- 実績 JSON-LD の `about` を登録済み名称による `Thing` オブジェクト配列へ変更。空値／未分類を除き、案件の新しい意味・役割・実績は追加しない。
- 共通ヘッダーの「本文へ移動」を全ページへ表示し、各下層の main と 404 に `id="main"`・`tabIndex={-1}` を設定。トップの既存挙動を保ち、下層は本文位置へ即時スクロールする。固定ヘッダーとの重なりを避けるスクロール余白を設定。
- 日記 Pagination は末尾スラッシュを正規化し、前後・番号リンクの `/diary//p/2` を解消。既存の trailingSlash 方針に合わせる。
- 目次生成では CMS の既存見出し ID を保持し、本文内の全既存 ID を予約して生成 ID の衝突を避ける。衝突しない従来の `section-N` は見出しの順番を維持する。引用符あり／なしの ID・tabindex と実体参照を検証した。既存 ID を含む直接フラグメントは CSS セレクターでなく ID で検索し、記事見出しは標準のフラグメント移動に任せる。

## 検証

Node.js 24.19.0、Next.js 16.4.1、リポジトリの lockfile を使用。依存関係・lockfile は変更なし。

| 項目 | 基準 | 修正後 |
| --- | --- | --- |
| `npm run lint` | 成功 | 成功 |
| `npm run typecheck` | 成功 | 成功 |
| `npm test` | 58件中56件成功 | 63件中62件成功 |
| `npm run build`（Turbopack、固定CMS） | 成功 | 成功 |
| `git diff --check` | 成功 | 成功 |

基準の失敗はフッターのコントラストと `tests/mainVisuals.test.mjs` の「KVは専門性と実績を先に伝え、実績とプロフィールの2導線を維持する」。修正後はフッターが成功し、KV の古い期待文言 `/WordPress \/ フロントエンド実装 \/ UI改善 \/ SEO/` と現行原稿「WordPress構築 / フロントエンド実装 / UI改善 / SEO対策」の不一致だけを保持している。対象外の原稿・期待値は変更していない。

追加5テストは修正前の失敗を確認したうえで実装した。ページ送り・既存 ID 保持・衝突回避・実体参照・従来生成番号・JSON-LD の名称と型を確認。カテゴリーの即時遷移と下層スキップリンク欠落も基準 production build のブラウザで再現した。

Chromium の実 production build を1440／390／320pxで検証した。トップ、About、Skill、Contact、日記一覧・2ページ目・カテゴリー・カテゴリー2ページ目・検索・詳細、実績一覧・2ページ目・詳細、ルート404・日記404の15ルート×3幅で以下を確認。

- main とスキップ対象が各1個。先頭 Tab でスキップリンクが可視になり、Enter で main にフォーカスし、次 Tab が本文内へ進む。横はみ出しなし。通常ルート200、未知ルート404。
- カテゴリーは矢印による選択だけでは遷移せず、Tab→Enter で送信。戻る、すべてへの復帰、query で指定した選択状態の再同期を確認。
- ページ送りの実 href に二重スラッシュなし。次ページと先頭への復帰をキーボード／クリックで確認。
- フッターの全6リンクへ Tab で到達。計算済みスタイルから文字4.857:1と3pxの濃色フォーカス枠を確認。PC／SP画像でも配置と枠を確認。
- 実記事 DOM の既存 `cms-anchor`、`design&build`、従来の `section-2` を確認。目次の Enter、次 Tab、履歴、直接 `#design%26build`、記事内 ID の一意性を確認。
- 実ページ内 JSON-LD を JSON として読み取り、`CreativeWork.about` が登録済み3名称の `Thing` になっていることを確認。
- JS 無効の390pxでもスキップフォーカス、カテゴリー GET 送信、すべてへの復帰が成功。

ブラウザ例外0。ブラウザは同じ localhost の GET のみ許可し、POST／外部通信を拒否する設定で検証した。送信試行も0。未知記事の検証でローカル fixture の404がサーバーログに出ることは想定内。ビルドには基準と同じ middleware→proxy の非推奨警告がある。

## 再実行

`tests/helpers/markupFixture.cjs` は既存の架空 CMS データへ既存 ID を追加する検証専用のプリロードで、製品経路からは読み込まない。実 CMS や本物のキーは使用しない。基準ビルドの取得キャッシュを混ぜないため、専用 worktree 内の `.next` を消してからビルドする。

```sh
MICROCMS_SERVICE_DOMAIN=profile-perf-fixture \
MICROCMS_API_KEY=fixture-not-a-key \
NEXT_TELEMETRY_DISABLED=1 \
NODE_OPTIONS=--require="$PWD/tests/helpers/markupFixture.cjs" \
npm run build
```

同じ環境指定で別ターミナルから起動する。

```sh
MICROCMS_SERVICE_DOMAIN=profile-perf-fixture \
MICROCMS_API_KEY=fixture-not-a-key \
NEXT_TELEMETRY_DISABLED=1 \
NODE_OPTIONS=--require="$PWD/tests/helpers/markupFixture.cjs" \
node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3218
```

Playwright は製品依存に追加せず、別ディレクトリへ導入する。今回の場所は `/tmp/profile-a11y-browser/node_modules/playwright`。

```sh
PLAYWRIGHT_MODULE=/tmp/profile-a11y-browser/node_modules/playwright \
node tests/markup.browser.mjs
```

証拠は `/tmp/profile-a11y-evidence/` の `results.json`、PC／SPの `category-*.png`・`footer-*.png` と各検証ログ。ブラウザスクリプトは localhost 以外を対象にできない。

## 未実施・残件

実 CMS の全記事、スクリーンリーダー実音声、他ブラウザ、本番／Preview は未検証。過去に拒否された本番 HTTP は再試行も迂回もしていない。

検索は既存どおり10件上限でページ送りなし。機能拡張として今回変更しない。metadata／robots／canonical／sitemap の方針、フォーム送信処理、GA、CMS、認証、本番設定は変更なし。他の同梱リポジトリは変更なし。

この文書は公開前のローカル検証記録。2026-10-27の公開承認により、この検証済み差分のpush・PR作成・merge・通常デプロイを進める。公開結果と対象SHAはPRに記録する。別SEO枝の作業は含めない。
