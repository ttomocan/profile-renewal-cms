/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: 'https://www.tomocan.site', // あなたのサイトのURL
  generateRobotsTxt: true, // robots.txtも生成する場合はtrue
  sitemapSize: 5000, // 1つのsitemapファイルに含めるURL数（デフォルト5000）
  changefreq: 'daily', // 更新頻度（例: daily, weekly, monthly）
  priority: 0.7, // 優先度（0.0 - 1.0）
  exclude: ['/admin/*', '/private/*'], // 除外したいページパス
};

module.exports = config;
