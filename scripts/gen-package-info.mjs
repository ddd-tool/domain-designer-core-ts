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

console.log('Package.json files generated for publish package.')
