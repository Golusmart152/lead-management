
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
    // Increase server timeout for large files
    fs: {
      strict: false
    },
    // Increase optimization timeout
    hmr: {
      overlay: false
    }
  },
  build: {
    // Optimize bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast'],
          charts: ['recharts'],
          utils: ['lodash', 'date-fns']
        }
      }
    },
    // Target modern browsers for better tree-shaking
    target: 'es2015',
    // Optimize CSS
    cssCodeSplit: true,
    // Source maps for production debugging
    sourcemap: false,
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000
  },
  // Optimize dependencies with more aggressive settings
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-toast',
      'recharts',
      'lucide-react'
    ],
    // Exclude large files that cause timeouts
    exclude: [
      'src/modules/dashboard/pages/DashboardPage.tsx'
    ],
    // Increase esbuild options for better performance
    esbuildOptions: {
      target: 'es2020',
      logOverride: { 'this-is-undefined-in-esm': 'silent' }
    }
  },
  // Increase pre-bundle timeout
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});
