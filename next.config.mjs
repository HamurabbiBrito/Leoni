import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otras configuraciones de Next.js...
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(process.cwd(), 'src'),
      '@services': path.resolve(process.cwd(), 'src/services'),
      '@utils': path.resolve(process.cwd(), 'src/utils')
    };
    return config;
  }
};

export default nextConfig;