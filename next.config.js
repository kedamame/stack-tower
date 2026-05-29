/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      // Bundle font files into the og-score serverless function
      '/og-score': ['./public/fonts/**'],
    },
  },
};
module.exports = nextConfig;
