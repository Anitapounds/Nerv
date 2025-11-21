/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    unoptimized: true, // Disable image optimization to avoid sharp issues on Vercel
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure all routes work properly on Vercel
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ];
  },
  // Handle trailing slashes
  trailingSlash: false,
  // Skip trailing slash redirect
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
