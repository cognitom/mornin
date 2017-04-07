import hid from 'node-hid'

export default function () {
  console.log('Checking your HID devices...')
  const stringify = JSON.stringify
  const devices = hid.devices()
    .map(device => ({
      manufacturer: device.manufacturer,
      product: device.product,
      vendorId: device.vendorId,
      productId: device.productId
    }))
    .sort((a, b) => {
      const a2 = stringify(a)
      const b2 = stringify(b)
      return (a2 === b2) ? 0 : (a2 < b2) ? -1 : 1
    })
    .filter((cur, pos, arr) => !pos || stringify(cur) != stringify(arr[pos - 1]))
    .forEach(device => {
      console.log('')
      console.log(`# ${device.product} by ${device.manufacturer || 'n/a'}`)
      console.log(`- vendorId:  ${device.vendorId}`)
      console.log(`- productId: ${device.productId}`)
    })
}
