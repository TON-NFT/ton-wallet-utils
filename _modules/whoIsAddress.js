import axios from 'axios'

export async function whoIsAddress(address) {
  const data = await axios.get('https://explorer.tonnft.tools/assets/files/address-book.json')
  const addressBook = data.data
  const addressInfo = addressBook[address]
  return (typeof addressInfo === 'string' ? addressInfo : addressInfo[0]) || 'Unknown'
}