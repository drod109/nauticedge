import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
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
          'react-vendor': ['react', 'react-dom'],
          'vendor': [
            'lucide-react',
            'date-fns',
            '@supabase/supabase-js',
            'zod'
          ],
          'app': [
            './src/utils',
            './src/components',
            './src/lib'
          ]
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
      '@supabase/supabase-js',
      'date-fns',
      'zod'
    ],
    exclude: []
  },
  server: {
    fs: {
      strict: false
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
