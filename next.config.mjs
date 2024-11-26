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
};

// リダイレクト設定を個別に定義
async function redirects() {
  return [
    {
      source: '/:path*',
      has: [
        {
          type: 'host',
          value: 'tomocan.site',
        },
      ],
      destination: 'https://www.tomocan.site/:path*',
      permanent: true,
    },
  ];
}

// 全体設定をエクスポート
module.exports = {
  ...nextConfig,
  redirects, // リダイレクト関数を追加
};
