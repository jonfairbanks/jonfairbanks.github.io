/** @type {import('next').NextConfig} */

const nextConfig = {
    basePath: "/",
    output: "export", // Enable static exports
    distDir: "out",
    reactStrictMode: true,
};

export default nextConfig;