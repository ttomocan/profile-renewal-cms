# スマホ速度の再計測

製品のproduction buildを、秘密値なしの固定CMS応答で比較する補助スクリプトです。本番コンテンツ・本番速度・microCMSやCDNの応答速度を再現するものではありません。製品の実行経路からは読み込みません。依存・lockfileは変更しません。

## 固定条件

- Chromium実機バージョンとホストCPUは `raw.json` の `conditions` に保存。
- 390×844 CSS px、DPR 3、タッチ・モバイル指定、固定Android UA。
- CDPでCPU 4倍、下り200,000 B/s、上り93,750 B/s、遅延150ms。
- 毎回新しいcontext、HTTPキャッシュ無効。Nextの画像最適化キャッシュは事前にウォーム。
- 14記事・14実績、トップは6枚ずつ、画像なしのデータも含む。画像はリポジトリ内の固定画像。記事の架空本文には一定のハッシュ文字列を含め、同じ文章の単純な繰り返しによる過度な圧縮を避ける。
- `npm run build`（Next既定のTurbopack）と `next start` を使う。開発サーバーは使わない。
- 基準と候補を同時起動し、各ルート5回ずつ、前後の順番を回ごとに反転。

## 準備・実行

Node 24、Chromium、別途導入したPlaywrightが必要です。Playwrightは製品依存に追加せず、必要なら `PLAYWRIGHT_MODULE` にその絶対パスを指定してください。スクリプトはlocalhostのみに接続します。

1. 基準 `658739d919ab4d116a5f7edaff47b656c3419c81` と候補コミットを別ディレクトリに展開し、それぞれ `npm ci --cache /tmp/profile-npm-cache --no-audit --no-fund` を実行します。
2. 両ディレクトリで同じfixtureを指定してビルドします。fixtureの絶対パスは候補checkout内のものに置き換えます。

```bash
MICROCMS_SERVICE_DOMAIN=profile-perf-fixture \
MICROCMS_API_KEY=fixture-not-a-key \
NEXT_TELEMETRY_DISABLED=1 \
NODE_OPTIONS=--require=/absolute/path/scripts/performance/cms-fixture.cjs \
npm run build
```

3. 別々のターミナルで、同じ環境指定により起動します。基準は3212、候補は3213を使用します。

```bash
MICROCMS_SERVICE_DOMAIN=profile-perf-fixture \
MICROCMS_API_KEY=fixture-not-a-key \
NEXT_TELEMETRY_DISABLED=1 \
NODE_OPTIONS=--require=/absolute/path/scripts/performance/cms-fixture.cjs \
node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3212
```

4. 候補checkoutから回帰確認とウォームアップを実行します。ウォームアップは比較に含めません。

```bash
ORIGIN=http://127.0.0.1:3213 node scripts/performance/regression.mjs
RUNS=1 OUTPUT=/tmp/profile-perf/warmup node scripts/performance/measure.mjs \
  before=http://127.0.0.1:3212 after=http://127.0.0.1:3213
```

5. ビルド・別のブラウザテスト等を止めた状態で計測します。

```bash
RUNS=5 OUTPUT=/tmp/profile-perf/final node scripts/performance/measure.mjs \
  before=http://127.0.0.1:3212 after=http://127.0.0.1:3213
```

`raw.json` に各試行のResource Timing・CDP転送量・文言ハッシュ・メタ情報・リンク・画像・例外、`summary.json` に中央値・min/max・p25/p75、PNGに各ルートの画面を保存します。

別途、自動先読みを有効にしたまま初期load後6秒待機してから、トップ→実績一覧・メニュー→日記一覧のDOM到達時間を各5回確認できます。主比較と同時に実行しないでください。

```bash
node scripts/performance/navigation.mjs before=http://127.0.0.1:3212 after=http://127.0.0.1:3213
```

先読みの完了やRouter Cacheへの完全格納を保証する条件ではありません。ブラウザのclickイベントから、driverのURL/selector待機と2回のrequestAnimationFrameまでを含む補助値です。画像読み込み完了、厳密なpaint、INPを示しません。

## 指標の意味

- FCP/LCP/CLSはPerformanceObserverで初期読み込みを観測したラボ値。CLSは最大セッションウィンドウを使用。フィールドCWVやPageSpeedスコアではありません。
- `overlayRemovedMs` は既存LoadingのDOMが除去された時刻。FCP/LCPがローディングの背後の文字を記録する場合の補足で、独自の観測値です。
- `observedBlockingMs` はナビゲーションからload後6秒までのlong taskについて `max(duration-50, 0)` を合計した独自指標。Lighthouse TBTではありません。
- `menuEventMaxMs` は開く・Escape操作のEvent Timing最大値。16ms閾値、8ms丸めがあり、フィールドINPではありません。nullは閾値以上のイベントが得られなかったことを示します。
- `transferBytes` / `jsTransferBytes` はCDPの完了済み応答のencodedDataLength合計で、ヘッダーを含みます。総転送はload後6秒までの画像・フォント・**自動RSC先読み**を含みます。
- `documentEncodedBytes` はナビゲーション応答の圧縮後本体、`documentDecodedBytes` は展開後本体。JS展開後サイズはResource Timingのscriptを合計します。
- topへの自動先読みも小さくなるため、他ページの総転送減少をそのページ自身のHTML減少と解釈しないでください。記事本文量に依存する削減を、本番の削減量として扱わないでください。

## 既存制限

`npm start` は `server.js` が未宣言のexpressを要求するため、そのままの環境では起動できません。今回はVercelで使うNext本体のproduction serverで計測し、server.js / compression / 依存関係は変更しません。

本体CSSを含む基準ビルドでは、SPの最後のスライドに到達してもnextボタンがdisabledになりません。候補も同じ位置・属性です。回帰スクリプトでは末尾への到達と、それ以上進まないことを検証します。この既存挙動の修正は今回に含みません。
