import fs from 'fs'
import path from 'path'

const rootDir = process.cwd()

fs.copyFileSync(path.join(rootDir, 'lib', 'check', 'wasm.js'), path.join(rootDir, 'dist', 'check', 'wasm.js'))
fs.copyFileSync(path.join(rootDir, 'lib', 'check', 'wasm.d.ts'), path.join(rootDir, 'dist', 'check', 'wasm.d.ts'))
fs.copyFileSync(
  path.join(rootDir, 'lib', 'check', 'wasm_bg.wasm.d.ts'),
  path.join(rootDir, 'dist', 'check', 'wasm_bg.wasm.d.ts')
)
