/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // only for local testing
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Allow all origins
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS', // Allowed methods
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization', // Allowed headers
          },
        ],
      },
    ];
  },
};

export default nextConfig;
