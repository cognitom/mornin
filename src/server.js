import {dirname, join} from 'path'
import request from 'request-promise-native'
import playSound from 'play-sound'
import {KeyboardLines} from 'node-hid-stream'

const apiBaseUrl = 'https://docs.google.com/forms/d/e'
const okSoundFile = '320655__rhodesmas__level-up-01.wav'
const ngSoundFile = '106727__kantouth__cartoon-bing-low.wav'

const player = playSound()

export default async function server (config) {
  try {
    const scanner = new KeyboardLines({
      vendorId: config.vendorId,
      productId: config.productId
    })

    scanner.on('data', data => checkIn(config.formId, config.fieldId, data))
    scanner.on('error', err => console.log('scanner error', err))
    process.on('exit', () => scanner.close())
    process.on('SIGINT', () => scanner.close())

    console.log('Touch your card...')
  } catch (err) {
    console.log("Error: couldn't open the device.")
    if (!process.env.SUDO_USER) console.log('Try sudo.')
  }
}

async function checkIn (formId, fieldId, cardNumber) {
  const soundDir = join(dirname(__dirname), 'sounds')
  console.log(`- card scanned: ${cardNumber}`)
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
