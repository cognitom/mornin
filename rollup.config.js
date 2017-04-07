import {join} from 'path'
import {readFileSync} from 'fs'
import asyncToGen from 'rollup-plugin-async'

const pkg = JSON.parse(readFileSync(join(__dirname, 'package.json')))
const external = Object.keys(pkg.dependencies).concat('path', 'os', 'mz/fs')

export default {
  entry: 'src/cli.js',
  dest: 'mornin.js',
  banner: '#!/usr/bin/env node\n',
  format: 'cjs',
  external,
  plugins: [
    asyncToGen()
  ]
}
