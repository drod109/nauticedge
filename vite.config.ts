import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'lucide-react',
            '@supabase/supabase-js',
            'date-fns',
            'zod',
            'jspdf',
            'jspdf-autotable'
          ]
        }
      }
    }
  },
});