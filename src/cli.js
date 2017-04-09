import {join} from 'path'
import {homedir} from 'os'
import {readFile} from 'mz/fs'
import {exec} from 'mz/child_process'
import server from './server.js'
import check from './check.js'

const defaultConfigFile = '.mornin.json'

main()

async function main () {
  if (process.argv[2] === 'check') return check()

  const home = await getHome()
  const configFile = process.argv[2] || join(home, defaultConfigFile)
  const config = await readConfig(configFile)
  server(config)
}

async function getHome () {
  if (!process.env.SUDO_USER) return homedir()

  const result = await exec(`echo ~${process.env.SUDO_USER}`)
  const home = result[0].trim()
  return home
}

async function readConfig (file) {
  try {
    const data = await readFile(file, 'utf8')
    const config = JSON.parse(data)
    return config
  } catch (err) {
    console.log(`Error: ${file} does not exist.`)
    throw err
  }
}
