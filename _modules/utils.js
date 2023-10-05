import TonWeb from 'tonweb'

export function flipAddressType(address) {
  if (!address) return ''
  return address.includes(':')
    ? (new TonWeb.utils.Address(address)).toString(true, true, true)
    : (new TonWeb.utils.Address(address)).toString(false, false, true)
}

export function flipAddressBouncableType(address) {
  if (!address) return ''
  if (address.length !== 48) return ''
  const isNonBouncable = address.startsWith('E')
  const bouncableAddress = new TonWeb.utils.Address(address).toString(true, true, true)
  const nonBouncableAddress = new TonWeb.utils.Address(address).toString(true, true, false)
  return isNonBouncable ? bouncableAddress : nonBouncableAddress
}

export function toRawAddress(address) {
  if (!address) return ''
  return address.includes(':')
    ? address
    : (new TonWeb.utils.Address(address)).toString(false, false, true)
}

export function toFriendlyAddress(address) {
  if (!address) return ''
  return address.includes(':')
    ? (new TonWeb.utils.Address(address)).toString(true, true, true)
    : address
}

export function shortAddress(address, length = 4) {
  if (!address) return ''
  return `${address.substring(0, length)}...${address.substring(address.length-length)}`
}

export const NNTN = 1e9