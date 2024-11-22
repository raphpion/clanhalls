import path from 'path';

import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

// https://vitejs.dev/config/
export default defineConfig({
  envDir: path.resolve(process.cwd(), '../'),
  plugins: [tsconfigPaths(), TanStackRouterVite(), react()],
  server: {
    host: '0.0.0.0',
    port: Number(process.env.FRONTEND_PORT || 3000),
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.BACKEND_PORT || 5000}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
