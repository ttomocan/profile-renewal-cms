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

export default nextConfig;

module.exports = {
  async redirects() {
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
  },
};
