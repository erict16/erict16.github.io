/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/repo',
  images: {
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
};

module.exports = nextConfig;
