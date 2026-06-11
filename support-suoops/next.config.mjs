/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the file-tracing root to this app to avoid Next.js inferring the wrong
  // workspace root when multiple lockfiles are present in the monorepo.
  outputFileTracingRoot: import.meta.dirname,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://api.suoops.com",
  },
};

export default nextConfig;
