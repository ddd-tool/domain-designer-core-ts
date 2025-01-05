import { defineConfig } from 'vitest/config'
import wasm from 'vite-plugin-wasm'

export default defineConfig({
  plugins: [wasm()],
  assetsInclude: ['**/*.wasm'],
  test: {
    globals: true,
    silent: false,
  },
  build: {
    target: 'es2017',
  },
})
