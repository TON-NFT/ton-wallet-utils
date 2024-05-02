import fetch from 'node-fetch'

export async function whoIsAddress(address) {
  const response = await fetch('https://explorer.tonnft.tools/assets/files/address-book.json')
  const addressBook = await response.json()
  const addressInfo = addressBook[address]
  return (typeof addressInfo === 'string' ? addressInfo : addressInfo[0]) || 'Unknown'
}