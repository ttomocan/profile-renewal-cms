# アクセシビリティレビューとSplide置換（ローカル・未公開）

対象: `ttomocan/profile-renewal-cms`（repository ID 886054756）、https://www.tomocan.site/ 。2026-10-12、WCAG 2.2 AAを目安にレビューしました。適合判定・適合保証ではありません。

## 対象と確認方法

本番Vercel `dpl_cFsGYqpX5dAKnZiymtctd9RMc6fM` と最新mainはいずれも `8212bfef01807e2156dccc295d2bc1938507b159`。`feat/a11y-splide` はこのmainから分離しました。PR #12の変更・マージは含めていません。

- 本体コード: 全ルートと共通Header/Footer、フォーム、CMS記事レンダラ、カード、CSS、モーション処理を調査し、独立レビューも実施。
- 親側の公開ブラウザ: Home、About、Skill、Result一覧／代表詳細、Diary一覧／本文、Contactの主要導線を確認。通常幅1180pxとブラウザ200%拡大での所見を受領。ここでは「公開確認」と記載。
- 実装側: 実Next.js 16.0.7／React 19.2.1／Splide 4.1.4、最終コンポーネントとCSSを使用する別のローカルNextアプリでCMS fixtureを表示。CMS API、サイト全体の本番データ取得・ヘッダー／フッター統合とは分離した検証です。
- スライダーについてPC/SP境界、320pxのリフロー、キーボード、reduced-motion、SSR/hydration、Nextクライアント遷移、再マウントを検証。読み上げはDOM/ARIA属性の確認であり、スクリーンリーダーの音声出力確認ではありません。

## 優先順位付きの監査所見と対応

P1は操作・現在位置の把握に大きく影響するため優先、P2は次の改善候補です。後から追加承認された5点と、公開再確認で確定した一覧focus・フッターfocus／文字・検索ボタン・同種の本文リンクは「修正済み」と示します。他の全体課題は報告のみです。コードだけの所見には再現確認の条件を付けています。

| 優先度／根拠 | 影響と確認方法 | 改善案／関連基準 |
| --- | --- | --- |
| **P1・修正済み／公開＋ローカル再現** `styles/layout/_l-header.scss:321`付近 | Contactを200%拡大、CSS viewport 590×378でメニューを開く→Tabでブログ2リンク→Top。Topのフォーカス位置がy=-44.55〜-8.55で画面外、scrollTop=0から上へ戻れない。中央寄せのメニューで内容が上側へはみ出す。Escape復帰・Tabtrap・背景inertは正常 | safe centerで収まり切らないときは上寄せ、96px上余白と縮小しない項目で到達可能に。590×378のローカル再現でTopのy=-44.8→96。320×400／390×320でも全Tab、trap、Escape、inertを回帰確認。表示切替中のhiddenリンクをfocus候補から除外し、開いた直後の素早いTabもメニュー内へ保持。1.4.10、2.4.11関連 |
| **P1・修正済み／日記は公開確認、実績は同じ構造** `styles/pages/result.scss:101`、`app/_components/DiaryList/index.module.css:12`、`styles/foundation/_base.scss:51` | 日記一覧カードの外側outlineが全クリップすることを親側公開再試験で確認。実績一覧も同じoverflow:hidden＋全面リンク構造のため対応。トップ2スライダーのfocus修正も保持 | 両一覧リンクを3px #69300b・outline-offset:-4px・角丸継承へ。親のclipと見た目は保持し、ローカル実Nextの1440/390/320pxで枠・画像・リンクを確認。2.4.7 |
| **P1・修正済み／公開確認** `styles/layout/_l-footer.scss:4`、`styles/foundation/_base.scss:52` | 従来はフッター背景と共通focus枠が同じ#f36b0aで見えないことを親側公開再試験で確認 | ブランド背景#f36b0aを維持し、footer専用3px #282828・offset:3pxの枠へ。全6リンクをTabで確認。2.4.7 |
| **P2・修正済み／公開確認＋色計算** `styles/layout/_l-header.scss`、`styles/global/_variables.scss` | currentナビ文字#f36b0a／背景#f2edeaは約2.61:1。公開計測22.4px・weight400で通常文字4.5:1未達 | desktop current/hoverを#b54708へ（背景#f2edeaで実測約4.67:1）。既存下線を保持。1.4.3 |
| **P2・一部修正済み／公開確認＋色計算** Category/SearchField/Pagination/Article各CSS、`styles/layout/_l-footer.scss`、result/about/skill各SCSS | #f36b0aと白は約3.04:1、小さいタグ、検索ボタン、現在ページ番号、本文リンク、フッター白文字、実績／プロフィール／スキルのリンクに不足。サイト背景とは2.61:1 | SearchFieldは#b54708／hover #8f3500へ、Article本文リンクは同色＋下線保持、hoverのopacity低下を廃止。Footerは背景を変えず文字・下線を#282828へ。通常／hover・PC/SP実CSSで4.5:1以上を確認。Category/Paginationと他のタグ・リンクは未対応。1.4.3 |
| **P2・必須表示は修正済み／公開確認＋色計算** `styles/object/project/_form.scss:53`、`:78` | Contact必須ラベルの白14px太字／赤#f3350aは3.94:1。エラー文字と淡い背景も約3.17:1。入力枠の薄い影について背景との境界を確認する必要あり | 必須表示を#cf2b08へ、白文字の実測約5.25:1。エラー文字・入力境界は今回未修正。文字1.4.3、入力境界は1.4.11を実機判定 |
| **P2・修正済み／公開＋ローカル確認** `app/_hooks/useSmoothScroll.ts:37`、`:54`、Article目次 | `/diary/work-childcare-balance/`で目次Enter後、見出しへスクロールするがactiveElementは画面外の目次リンク(y約-1995)、次Tabで次の目次へ戻る。hashも更新されない | CMS本文レンダラの生成h2/h3へtabindex=-1、目次はネイティブanchor/hash/historyへ戻し、既存scroll-marginを保持。実ブラウザで見出しfocus→次Tab本文リンク、hash戻る・直接URLを確認。2.4.3関連 |
| **P2・コード所見** `app/_components/CategoryFilter/index.tsx:15`、`:25` | select変更で事前説明なく別URLへ移動。キーボードで候補確認中にコンテキストが変わる | 「表示」ボタン、または選択すると遷移する事前説明。3.2.2 |
| **P2・無名グループは修正済み** `app/_components/ContactForm/index.tsx:108`、`:115`、`:140` | 外側fieldsetにlegendがあるが内側role=radiogroupは無名。エラー文と入力欄のaria-describedby関連なし。エラー時のfocus移動・alertは実装済み | 内側radiogroupを削除しlegendで名付けたnative fieldsetを維持。実ブラウザAXで1つの名前付きgroup・5radioを確認。エラー欄との関連付けは未修正。4.1.2、3.3.1関連 |
| **P2・要確認** ContactForm成功時 | 成功時にfocus中フォームが削除される。role=statusはあるがsuccessメッセージにfocusを移す処理なし | 実送信を伴わないfixtureでsuccess時のfocus／読み上げを確認 |
| **P2・要確認** `styles/common/animation.scss:109`、`app/DynamicBodyClass.tsx:74` | fadeUpTriggerが透明の初期状態。表示判定に追加150pxを要求し、Tabで移動した低い位置のCTAが透明のままになる可能性 | focus-withinでは必ず表示する。今回スライダーカードのみ対応。2.4.7関連 |
| **P2・CMS個別確認** `lib/tableOfContents.ts:30`、Article本文 | 汎用alt／alt未設定を一律空altにする。装飾なら適切だが画面説明／図表なら情報を失う。全CMS画像・表・iframe・動画字幕は未確認 | 画像の意味に応じたCMS代替文、表見出し・埋め込みの名前・字幕の確認。1.1.1等 |

## 追加提案と既にできている点

下層にはmainランドマークがありますが、スキップリンクはHomeだけです。全ページへのスキップ導線拡張を推奨します。mainがあるためこれだけで2.4.1不適合と断定しません。

WaveAnimationは初期のreduce判定後、resizeで無条件にアニメーションを再開します。useSmoothScrollの目次以外は無条件smoothのままです。今回の目次はブラウザ標準処理＋既存reduce CSSを利用します。reduce尊重を提案しますが、2.3.3はAAAであり、この点をそのままAA違反と扱いません。常時動く波について2.2.2の適用・停止手段も個別確認が必要です。

パンくずのnowrap／縮小禁止による長いタイトルのリフローは320pxで追加確認が必要です。画像altの有無だけでは意味の適切さを判定できません。

公開確認でHomeスキップのTab→Enter→main→次Tab本文CTAは正常。検索／カテゴリのラベル、Contactラベル・required・autocomplete・ラジオ矢印操作、メニューEscape・focus制限・inertは正常。About表のth scope=row、主要ページh1各1・見出し飛びなし、lang=ja、装飾／カードと重複する画像の空altを確認しました。

## 今回のSplide変更

既存スライダーはHomeのResultsSlider（制作実績最大6＋個人開発）とDiarySlider（CMS日記）の自前横スクロールのみでした。旧スライダー依存はないため削除なし。追加はcore `@splidejs/splide@4.1.4`だけです（2026-10-12 registryでlatest確認）。React wrapper 0.7.12は使用していません。

共通CardSliderはuseEffectでmount／cleanupでdestroy、React useIdでSSRとclientのIDを合わせます。Splide部分destroyで子リンクのtabindexとイベントが復元されない点を補うため、extensionで再登録し元の値を復元します。初回mounted時にもfocusを退避し、labelをoptionsで明示してStrict Mode／再effectで維持します。PC768px以上は既存3列grid、767px以下だけslideを有効化。loop・rewind・autoplay・paginationはfalse、cloneを生成せず、ドラッグ以外に50px前後ボタンを提供します。paginationは元々ないため追加していません。

名前付きgroup、前後の日本語名、カード番号の日本語化、Splide標準live、hiddenカードのtabindex制御、reducedMotionのspeed=0を利用します。カードと矢印のfocus枠を見える色へ、カード枠はクリッピングを避け内側へ配置。自動再生なしのため停止／再開ボタンは不要で、focusoutによる自動再開もありません。画像・CMS取得・本文・記事タイトル・リンク先は変更していません。

## 日記詳細のリンクスタイルの取り残し確認

新Previewの実CMS再QAを親側で行い、日記／実績のfocus、Footer／Search／本文リンク、メニュー／目次／Splideの既存修正が通過しました。追加で `/diary/iropon-release/` の「同じカテゴリーの関連記事」3リンクに旧配色が残っていることを確認し、同種の記事リンク修正として対応しました。

| 詳細内の箇所 | 確認した実スタイル／今回の対応 |
| --- | --- |
| Article本文 `.content a` | 既存修正を保持。通常／focus #b54708、hover #8f3500、下線。サイト背景上約4.67:1／6.75:1 |
| 詳細の関連記事／関連ページ `.related a` | `app/diary/[slug]/page.module.css` の1つの共通ルール。旧#f36b0a（約2.61:1）を#b54708、hover #8f3500へ。3px #69300bのfocus枠追加、下線・内容・リンク先・件数・表示条件を保持 |
| Article目次 `.tableOfContents a` | #333＋下線。今回変更なし。ネイティブhash／見出しfocus修正を保持 |
| 「活動記録の一覧へ」 | 実DOMは共通 `c-button__link` の濃色背景を使用。実Nextで白字4.5:1以上とURL `/diary/` を確認。詳細CSS内の同名ローカルクラスはglobalの実クラスへ適用されないため、未使用ルールの整理は行わない |
| カテゴリーへのリンク | 共通Categoryの白文字／橙色バッジ＋hover opacity。関連記事の通常テキストとは別の共有スタイル。静的候補として報告済み、今回変更しない |
| 共通パンくずへのリンク | 通常#282828、hoverは旧橙色＋淡橙背景。hoverの文字コントラスト改善候補は共有Breadcrumbの別範囲として記録し、今回変更しない |
| Header/Footer／運営ブログ | 既存の修正・スタイルを保持。グローバルブランド色や外部ブログ機能は変更しない |

同じ `.related a` が2セクションをカバーし、対象の記事詳細専用ルールに旧橙色のリンク文字は残っていません。見出しの装飾線、コードファイル名・表のラベル色など、リンク以外の配色は今回の対象に含めていません。

実Nextのfixtureに本体の `app/diary/[slug]/page.tsx` をimportし、CMS I/Oだけ一時アプリのwebpack aliasへ置換。関連記事3＋関連ページ4を1440／390／320pxで通常・hover・実Tab focus測定し、下線・3px枠、自己記事除外、URL・一覧に戻る導線を確認。実CMSの最終再QAは新SHA Previewを親側で確認します。`related-focus-{1440,390,320}.png` と検証JSONへ記録しています。

## 検証記録と限界

単体／回帰テスト35/35、typecheck、lint、git diff --check成功。既存Baselineデータ更新警告のみ残ります。ソースのSSRテストはCMSへの通信なしで実コンポーネントをrenderToStaticMarkupします。独立レビューで発見したSplideのイベント消失・hidden初回focus・tabindex復元・label消失の4件を修正し、実ブラウザの幅変更／再マウントで確認しました。

ブラウザ回帰の再実行方法（リポジトリルートから、2つを順に実行。ローカルport3134を使用）:

```sh
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs BROWSER_EXECUTABLE=/path/to/chromium node tests/sliders.browser.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs BROWSER_EXECUTABLE=/path/to/chromium node tests/accessibility.browser.mjs
```

Playwrightは実行環境の既存ツールを利用し、製品依存へ追加していません。ヘルパーは一時ディレクトリのNextアプリから実コンポーネントをimportし、実next/link・next/image・React effectを動かします。Next設定・publicの参照はfixture側のみで、本体へのバックドアやCMSモック設定は追加していません。fixture画像は既存のローカルOGP、文章・CMSデータはfixtureです。

`/tmp/a11y-evidence/checks.json`、`five-checks.json`、`sliders-{1440,768,767,390,320}.png`に検証記録とレイアウト画像を保存しています。一覧card・Footerのfocus画像を focus-diary／focus-result／footer-focus-{1440,390,320}.png に保存しました。実Nextの一覧fixtureに実DiaryList・ResultCard・Footerを使い、親overflowと枠の内側配置、Footer全リンクのTab、実computed color、検索／本文リンクの通常・hover・下線と不透明度を確認しました。フッターの文字／focus枠はブランド背景に対して約4.86:1、検索ボタンは通常約5.43:1、本文リンクは通常約4.67:1です。

幅変更時のfocus退避、desktopで全リンクのTab復元、無JS時全13リンク、Nextクライアント遷移後の再mount、cloneなし、日本語操作名、hiddenリンクtabindex=-1、標準live、reduced-motion、全カードへの前後操作を確認します。通常motionでも自動送りがないことを確認し、スクリーンリーダーの実音声確認とは区別しています。

追加承認5点の修正はHeader SCSS、ContactForm、フォームSCSS、tableOfContentsとuseSmoothScrollに限定しました。公開再試験後の追加承認により、DiaryList／Result一覧のfocus、SearchField／Article本文リンク／Footerの配色・focusを最小CSS差分で追加修正しました。スキップ導線の全ページ拡張、aria-current、入力枠、画像alt等の他の提案は実装していません。

本体buildはcompileとTypeScript成功後、`MICROCMS_SERVICE_DOMAIN is required` によりCMSを使うルートのデータ収集が停止しました。CMS認証／環境設定の追加・変更はしていません。ローカルfixtureの成功は本体のCMSを含む本番ビルド成功と同義ではありません。

公開CMS全記事・全端末・全状態、Safari/Firefox、NVDA/VoiceOver等の実読み上げ、実フォーム送信成功、400%ズーム／200%文字拡大／文字間隔変更の全ページは未確認です。公開QAからの所見とコード静的所見を区別しています。自動／静的検査だけでは意味の適切さや全操作を証明できず、WCAG 2.2 AA適合を保証しません。

GitHubの専用ブランチへのpush、Draft PR、確認用Previewの作成は承認を受けたため進めます。mainへのマージ、本番公開、CMSコンテンツ変更、認証・セキュリティ・共有設定変更は今回実施しません。

## 判断資料

- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C APG Carousel](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)
- [Splide Accessibility](https://splidejs.com/guides/accessibility/)
- [Splide Options](https://splidejs.com/guides/options/)
- [Splide i18n](https://splidejs.com/guides/i18n/)
- [React Splide lifecycle資料（wrapperは不採用）](https://splidejs.com/integration/react-splide/)
