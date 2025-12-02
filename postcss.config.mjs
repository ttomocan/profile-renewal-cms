/**
 * PostCSS設定ファイル
 * Next.jsはデフォルトでpostcss-flexbugs-fixesとautoprefixerを使用しますが、
 * この設定ファイルでautoprefixerの動作をカスタマイズできます。
 *
 * @type {import('postcss-load-config').Config}
 */
const config = {
  plugins: {
    // Autoprefixer: ベンダープレフィックスを自動追加
    autoprefixer: {
      // サポートするブラウザの指定
      // 日本の主要ブラウザを考慮した設定
      overrideBrowserslist: [
        '> 0.5%', // 世界シェア0.5%以上のブラウザ
        'last 2 versions', // 各ブラウザの最新2バージョン
        'not dead', // メンテナンスされていないブラウザを除外
        'not op_mini all', // Opera Miniを除外
      ],
      // CSS Gridレイアウトの自動修正を有効化
      // 古いブラウザでもGridが動作するように自動的にプレフィックスを追加
      grid: 'autoplace',
    },
    // 注意: postcss-flexbugs-fixesはNext.jsが自動的に含めます
    // 明示的に追加する必要はありません
  },
};

export default config;
