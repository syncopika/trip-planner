// vite.config.js

import { defineConfig } from 'vite';
import createVuePlugin from '@vitejs/plugin-vue'
import * as path from 'path';

export default defineConfig(({ mode }) => {
  if(mode === 'iframe'){
    // build just the iframe
    return {
      build: {
        rollupOptions: {
          input: 'public/iframeSetup.ts',
          output: {
            file: 'public/bundle.js',
            dir: undefined
          }
        },
        emptyOutDir: false,
      }
    }
  }else{
    // build the app
    return {
      plugins: [createVuePlugin()],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
        },
      },
      build: {
        emptyOutDir: false,
      },
      test: {
        globals: true,
        environment: 'jsdom',
      }
    }
  }
})

