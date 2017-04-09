import {join} from 'path'
import {readFileSync} from 'fs'
import asyncToGen from 'rollup-plugin-async'

const pkg = JSON.parse(readFileSync(join(__dirname, 'package.json')))
const deps = Object.keys(pkg.dependencies)
const more = ['path', 'os', 'mz/fs', 'mz/child_process']
const external = deps.concat(more)

export default {
  entry: 'src/cli.js',
  dest: 'dist/mornin.js',
  banner: '#!/usr/bin/env node\n',
  format: 'cjs',
  external,
  plugins: [
    asyncToGen()
  ]
}
