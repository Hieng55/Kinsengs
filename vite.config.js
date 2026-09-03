import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const wordpressProxy = {
  target: 'https://kinsengs.com',
  changeOrigin: true,
  secure: true,
};

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/wp-json': wordpressProxy,
    },
  },
  preview: {
    proxy: {
      '/wp-json': wordpressProxy,
    },
  },
});
