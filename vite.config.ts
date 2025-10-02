import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { defineConfig as define } from 'vite';

// https://vitejs.dev/config/
export default define({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
