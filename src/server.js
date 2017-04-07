import {dirname, join} from 'path'
import {homedir} from 'os'
import request from 'request-promise-native'
import playSound from 'play-sound'
import {readFile} from 'mz/fs'
import {KeyboardLines} from 'node-hid-stream'

const apiBaseUrl = 'https://docs.google.com/forms/d/e'
const okSoundFile = '320655__rhodesmas__level-up-01.wav'
const ngSoundFile = '106727__kantouth__cartoon-bing-low.wav'
const configFile = '.mornin.json'

const player = playSound()

export default async function start () {
  try {
    const config = await readConfig(join(homedir(), configFile))
    const scanner = new KeyboardLines({
      vendorId: config.vendorId,
      productId: config.productId
    })

    scanner.on('data', data => checkIn(config.formId, config.fieldId, data))
    scanner.on('error', err => console.log('scanner error', err))
    process.on('exit', () => scanner.close())
    process.on('SIGINT', () => scanner.close())

    console.log('touch your card...')
  } catch (err) {
    console.log("Error: couldn't open the device. Try sudo.")
  }
}

async function readConfig (file) {
  try {
    const data = await readFile(file, 'utf8')
    const config = JSON.parse(data)
    return config
  } catch (err) {
    console.log(`Put your config file to ${file}`)
    throw err
  }
}

async function checkIn (formId, fieldId, cardNumber) {
  const soundDir = join(dirname(__dirname), 'sound')
  console.log(`card scanned: ${cardNumber}`)
  try {
    const uri = `${apiBaseUrl}/${formId}/formResponse?${fieldId}=${cardNumber}`
    const response = await request({uri, resolveWithFullResponse: true})
    if (response.statusCode === 200) {
      player.play(join(soundDir, okSoundFile))
    } else {
      console.log(`error: ${response.statusCode}`)
      player.play(join(soundDir, ngSoundFile))
    }
  } catch (err) {
    console.log(`error: ${err}`)
    player.play(join(soundDir, ngSoundFile))
  }
}
