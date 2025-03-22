import { defineConfig } from 'vitest/config'
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

export default defineConfig({
  plugins: [wasm(), topLevelAwait()],
  assetsInclude: ['**/*.wasm'],
  test: {
    globals: true,
    silent: false,
    coverage: {
      include: ['lib/**'],
    },
    exclude: ['node_modules/**', 'lib/__tests__/check.test.ts'],
  },
  build: {
    target: 'es2017',
  },
})
