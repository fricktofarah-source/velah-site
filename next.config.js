/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.drinkvelah.com" }],
        destination: "https://drinkvelah.com/:path*",
        permanent: true,
      },
    ];
  },
  // you can add other options here later
};

module.exports = nextConfig;
