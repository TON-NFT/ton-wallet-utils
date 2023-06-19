import fetch from 'node-fetch'

export async function getTransactions({ address, limit = 10, TON_API_TOKEN = '' }) {
  const headers = {}

  if (TON_API_TOKEN) headers['Authorization'] = `Bearer ${TON_API_TOKEN}`

  try {
    const result = await fetch(`https://tonapi.io/v2/blockchain/accounts/${address}/transactions?limit=${limit}`, { headers })
    const data = await result.json()
    if (!data?.transactions) throw new Error('Invalid response')
    const { transactions } = data
    return { transactions }
  } catch (e) {
    return { error: e }
  }
}