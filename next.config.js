/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['framer-motion', 'react-intersection-observer'],

  compress: true,
  
  // Enable experimental features for better SSR
  experimental: {
    optimizePackageImports: ['framer-motion', 'swiper'],
  },
  
  // API proxy to avoid CORS issues
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://0vm9jauvgc.execute-api.us-east-1.amazonaws.com/stag/api/:path*',
      },
    ];
  },

  
  // Static file caching for fonts
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Add headers for better SSR performance
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'torando-stagging.s3.amazonaws.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'torando-stagging.s3.amazonaws.com/products',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'd1ynvtqfnieipx.cloudfront.net',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'dvpfmafpu47o8.cloudfront.net',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'torando.s3.us-east-1.amazonaws.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'thprolink.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'd30830icnyj9e1.cloudfront.net',
        pathname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      module: false,
      path: false,
    };
    return config;
  },
}

module.exports = nextConfig;
