import axios from 'axios'
import { flipAddressType } from './utils.js'
import { TON_API_KEY, IPFS_GATEWAY } from '../private/config.js'

export async function getJettons({ address }) {
  const rawAddress = flipAddressType(address)

  try {
    const url = `https://tonapi.io/v2/jetton/getBalances?account=${rawAddress}`
    const { statusText, data } = await axios.get(url, { headers: { 'Authorization': `Bearer ${TON_API_KEY}` } })
    if (statusText === 'OK') {
      let jettons = []

      if (data.balances) {
        for (const tokenBalance of data.balances) {
          tokenBalance.balance = +tokenBalance.balance

          const url = `https://tonapi.io/v2/jetton/getInfo?account=${tokenBalance.jetton_address}`

          const { statusText, data } = await axios.get(url, { headers: { 'Authorization': `Bearer ${TON_API_KEY}` } })

          const tokenBalanceWithInfo = { ...tokenBalance }
          if (statusText === 'OK') {
            tokenBalanceWithInfo.jetton_info = data
            delete tokenBalanceWithInfo.metadata
          }
          jettons.push(tokenBalanceWithInfo)
        }

        jettons = jettons.map(jetton => {
          const a = +`1${'0'.repeat(jetton.jetton_info.metadata.decimals)}`
          jetton.jetton_info.metadata.address = flipAddressType(jetton.jetton_info.metadata.address)
          jetton.balance = jetton.balance / a
          jetton.jetton_info.total_supply = +jetton.jetton_info.total_supply / a
          if (!jetton.jetton_address || !jetton.wallet_address?.address) return jetton
          jetton.jetton_address = flipAddressType(jetton.jetton_address)
          jetton.wallet_address.address = flipAddressType(jetton.wallet_address.address )
          jetton.jetton_info.metadata.image = jetton.jetton_info?.metadata?.image?.replace('ipfs://', IPFS_GATEWAY)
          return jetton
        })

        return jettons
      }
    }
  } catch(e) {
    console.log(e.code)
    return []
  }
}