// vite.config.js
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

import glslify from './vite-plugins/vite-glslify';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [glslify()],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
      '@js': path.resolve(__dirname, './src/js')
    },
  },
});