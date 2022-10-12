// vite.config.js
import { defineConfig } from 'vite';
const path = require('path');
import glslify from './vite-plugins/vite-glslify';

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