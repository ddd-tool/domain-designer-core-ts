import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [],
  assetsInclude: [],
  test: {
    globals: true,
    silent: false,
    coverage: {
      include: ['lib/**'],
    },
  },
  build: {
    target: 'es2017',
  },
})
