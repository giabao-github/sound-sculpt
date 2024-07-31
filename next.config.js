/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: '/pages/:path*',
        destination: 'http://localhost:5000/:path*',  // replace with your Flask server URL
      },
    ]
  },
}

module.exports = nextConfig
