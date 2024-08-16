// vite.config.js

import { defineConfig } from 'vite';
import createVuePlugin from '@vitejs/plugin-vue'
import * as path from 'path';

// https://vitejs.dev/config/
//export default defineConfig({
//  plugins: [vue()]
//});

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
      plugins: [
        createVuePlugin({
          template: {
            compilerOptions: {
              compatConfig: {
                MODE: 2
              }
            }
          }
        })
      ],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src"),
          vue: '@vue/compat'
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

