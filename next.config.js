/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dev-basic-headless-cms-app.pantheonsite.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
