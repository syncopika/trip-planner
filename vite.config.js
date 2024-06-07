// vite.config.js

import { defineConfig } from 'vite';
import { createVuePlugin as vue } from 'vite-plugin-vue2';

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
      plugins: [vue()],
      build: {
        emptyOutDir: false,
      }
    }
  }
})

