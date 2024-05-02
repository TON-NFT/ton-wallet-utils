import fetch from 'node-fetch'

export async function getTonPrice() {
  let tokenPrice = await fetch('https://connect.tonhubapi.com/price')
  tokenPrice = await tokenPrice.json()

  return tokenPrice.price.usd
}