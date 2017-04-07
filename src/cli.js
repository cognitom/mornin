import server from './server.js'
import check from './check.js'

if (process.argv[2] === 'check') check()
else server()
