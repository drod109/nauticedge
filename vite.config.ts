import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    modulePreload: {
      polyfill: true
    },
    sourcemap: true,
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production'
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
          'data-vendor': ['date-fns', '@supabase/supabase-js', 'zod'],
          'settings': [
            './src/pages/Settings',
            './src/components/settings'
          ],
          'auth': [
            './src/pages/Login',
            './src/pages/SignUp',
            './src/components/auth'
          ],
          'dashboard': [
            './src/pages/Dashboard',
            './src/components/dashboard'
          ]
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      '@supabase/supabase-js',
      'date-fns',
      'zod'
    ],
    exclude: [],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  server: {
    fs: {
      strict: false
    },
    hmr: {
      overlay: true
    },
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), camera=(), microphone=()'
    }
  }
}));
