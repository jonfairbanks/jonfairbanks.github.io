/** @type {import('next').NextConfig} */

const nextConfig = {
    output: "export", // Enable static exports
    devIndicators: false,
    reactStrictMode: true,
    experimental: {
        inlineCss: true,
    },
};

export default nextConfig;
