import fetch, { Headers } from 'node-fetch'
import { NNTN, TON_API_KEY, TON_API_URL } from '../private/config.js'

export async function getBalance({ address }) {
  const options = { method: 'GET', headers: new Headers({ 'Authorization': `Bearer ${TON_API_KEY}` }) }
  const response = await fetch(`${TON_API_URL}account=${address}`, options)
  const userData = await response.json()
  const balance = userData?.balance / NNTN || 0
  return balance
}