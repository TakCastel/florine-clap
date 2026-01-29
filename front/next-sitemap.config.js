/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://florineclap.com',
  generateRobotsTxt: true,
  sitemapSize: 5000,
}


