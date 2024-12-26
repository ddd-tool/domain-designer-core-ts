import fs from 'node:fs'
import path from 'node:path'
import { readPackageSync } from 'read-pkg'

const rootDir = process.cwd()

const packageJsons = readPackageSync()
const publishPackageInfo = {
  ...packageJsons,
  sideEffects: false,
  private: false,
  module: 'index.js',
}
delete publishPackageInfo.scripts
delete publishPackageInfo.readme
delete publishPackageInfo.files
delete publishPackageInfo.devDependencies
delete publishPackageInfo._id

fs.writeFileSync(path.join(rootDir, 'dist', 'package.json'), JSON.stringify(publishPackageInfo, null, 2), 'utf8')

fs.copyFileSync(path.join(rootDir, 'README.md'), path.join(rootDir, 'dist', 'README.md'))

// fs.copyFileSync(path.join(rootDir, 'lib', 'wasm', 'wasm_bg.js'), path.join(rootDir, 'dist', 'wasm', 'wasm_bg.js'))
// fs.copyFileSync(path.join(rootDir, 'lib', 'wasm', 'wasm_bg.wasm'), path.join(rootDir, 'dist', 'wasm', 'wasm_bg.wasm'))
// fs.copyFileSync(
//   path.join(rootDir, 'lib', 'wasm', 'wasm_bg.wasm.d.ts'),
//   path.join(rootDir, 'dist', 'wasm', 'wasm_bg.wasm.d.ts')
// )
// fs.copyFileSync(path.join(rootDir, 'lib', 'wasm', 'wasm.d.ts'), path.join(rootDir, 'dist', 'wasm', 'wasm.d.ts'))
// fs.copyFileSync(path.join(rootDir, 'lib', 'wasm', 'wasm.js'), path.join(rootDir, 'dist', 'wasm', 'wasm.js'))

console.log('Package.json files generated for publish package.')
