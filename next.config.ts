/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'costaanderson.pythonanywhere.com',
        pathname: '/media/**',
      },
    ],
  },
};

module.exports = nextConfig;
