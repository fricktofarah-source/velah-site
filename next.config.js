/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['gsap', '@gsap/react', '@headlessui/react'],
  async redirects() {
    return [
      // Shareable link (e.g. for WhatsApp) that opens the site with the waitlist form showing
      { source: '/waitlist', destination: '/?waitlist=1', permanent: false },
    ];
  },
  // you can add other options here later
};

module.exports = nextConfig;
