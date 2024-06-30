import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  envDir: '../',
  plugins: [react()],
  server: {
    port: 3000,
  },
});

