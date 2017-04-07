#!/usr/bin/env node
import mornin from './mornin.js'
import check from './check.js'

if (process.argv[2] === 'check') check()
else mornin()
