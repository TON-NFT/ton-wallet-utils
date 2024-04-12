import { Address } from '@ton/ton'

export function getNonBouncable(toAddress) {
  try {
    toAddress = Address.parse(toAddress)
    return toAddress.toString({ urlSafe: true, bounceable: false, testOnly: false })
  } catch (e) {
    console.log(e)
    return toAddress
  }
}