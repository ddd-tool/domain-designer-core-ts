import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    minify: 'esbuild',
    outDir: 'dist',
    target: 'esnext',
    lib: {
      entry: fileURLToPath(new URL('./lib/index.ts', import.meta.url)),
      name: 'domain-designer-core',
      fileName: 'index',
      formats: ['es'],
    },
  },
})
