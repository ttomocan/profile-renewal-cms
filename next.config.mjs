/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
      },
    ],
  },
  trailingSlash: true,
  // HTML圧縮とパフォーマンス最適化
  compress: true, // Gzip圧縮を有効化
  poweredByHeader: true, // X-Powered-By ヘッダーを削除
  reactStrictMode: true, // React Strict Modeを有効化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // 本番環境でconsole.logを削除
  },
  experimental: {
    // optimizeCss: true, // critters依存関係のため一時的に無効化
  },
  async redirects() {
    return [
      {
        source: '/:path*', // 全てのパスを対象にする
        has: [
          {
            type: 'host',
            value: 'tomocan.site', // wwwなしのドメイン名を指定
          },
        ],
        destination: 'https://www.tomocan.site/:path*', // www付きにリダイレクト
        permanent: true, // 301リダイレクト
      },
    ];
  },
};

export default nextConfig;
