import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import wasm from 'vite-plugin-wasm'

export default defineConfig({
  plugins: [wasm()],
  assetsInclude: ['**/*.wasm'],
  build: {
    minify: 'esbuild',
    outDir: 'dist',
    target: 'esnext',
    // lib: {
    //   entry: fileURLToPath(new URL('./lib/index.ts', import.meta.url)),
    //   name: 'domain-designer-core',
    //   fileName: 'index',
    //   formats: ['es'],
    // },
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./lib/index.ts', import.meta.url)),
        check: fileURLToPath(new URL('./lib/check/index.ts', import.meta.url)),
      },
      output: {
        minifyInternalExports: true,
        dir: 'dist',
        format: 'esm',
        entryFileNames: (s) => {
          return s.name === 'index' ? 'index.mjs' : 'check/index.mjs'
        },
      },
    },
    lib: {
      entry: '',
      formats: ['es'],
    },
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
})
