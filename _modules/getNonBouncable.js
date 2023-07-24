import { Address } from 'ton'

export function getNonBouncable(toAddress) {
  toAddress = Address.parse(toAddress)
  return toAddress.toFriendly({ urlSafe: true, bounceable: false, testOnly: false })
}