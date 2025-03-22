import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

export default defineConfig({
  plugins: [wasm(), topLevelAwait()],
  assetsInclude: ['**/*.wasm', 'lib/**/*.js'],
  build: {
    minify: 'esbuild',
    outDir: 'dist',
    target: 'esnext',
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        // 指定 wasm 文件格式
        assetFileNames: ({ name }) => {
          return name?.endsWith('.wasm') ? 'assets/[name].[hash][extname]' : 'assets/[name].[hash].[ext]'
        },
      },
    },
    lib: {
      entry: fileURLToPath(new URL('./lib/index.ts', import.meta.url)),
      name: 'domain-designer-core',
      fileName: 'index',
      formats: ['es'],
    },
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
})
