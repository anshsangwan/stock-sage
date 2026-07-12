import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  turbopack: {
    root: __dirname,
    resolveAlias: {
      '@/components': './components',
      '@/lib': './lib',
      '@/components/*': './components/*',
      '@/lib/*': './lib/*',
    },
  },
};

export default nextConfig;
