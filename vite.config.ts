import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    
    // Get environment variables from multiple sources
    const geminiApiKey = env.GEMINI_API_KEY || 
                        env.VITE_GEMINI_API_KEY || 
                        process.env.GEMINI_API_KEY || 
                        process.env.VITE_GEMINI_API_KEY;
    
    return {
      root: '.',
      build: {
        outDir: 'dist',
        sourcemap: false, 
      },
      server: {
        port: 5173,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.GEMINI_API_KEY': JSON.stringify(geminiApiKey),
        'process.env.NODE_ENV': JSON.stringify(mode),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      }
    };
});
