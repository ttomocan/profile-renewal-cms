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
  // async redirects() {
  //   return [
  //     {
  //       source: '/:path*', // 全てのパスを対象にする
  //       has: [
  //         {
  //           type: 'host',
  //           value: 'tomocan.site', // wwwなしのドメイン名を指定
  //         },
  //       ],
  //       destination: 'https://www.tomocan.site/:path*', // www付きにリダイレクト
  //       permanent: true, // 301リダイレクト
  //     },
  //   ];
  // },
};

export default nextConfig;
