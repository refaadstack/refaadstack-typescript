/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  serverActions: {
    bodySizeLimit: '4mb',
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  async redirects() {
    return [
      {
        source: '/projects',
        destination: '/portfolio',
        permanent: true,
      },
      {
        source: '/projects/:slug',
        destination: '/portfolio/:slug',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
