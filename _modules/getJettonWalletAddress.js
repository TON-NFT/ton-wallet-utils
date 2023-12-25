import axios from 'axios'
import { TON_API_KEY } from '../private/config.js'
import { tonweb, tonMnemonic } from '../private/tonweb.js'
import { toFriendlyAddress, toRawAddress } from './utils.js'

export async function getJettonWalletAddress({ jettonAddress, walletAddress, mnemonic, version = 'v4R2' }) {
  if (!walletAddress) {
    const keyPair = await tonMnemonic.mnemonicToKeyPair(mnemonic)
    const { publicKey } = keyPair
    const WalletClass = tonweb.wallet.all[version]
    const wallet = new WalletClass(tonweb.provider, { publicKey, wc: 0 })
    const addr = await wallet.getAddress()
    walletAddress = addr.toString(true, true, true, false)
  }

  const rawAddress = toRawAddress(walletAddress)
  const rawJettonAddress = toRawAddress(jettonAddress)

  const url = `https://tonapi.io/v2/jetton/getBalances?account=${rawAddress}`
  const { statusText, data } = await axios.get(url, { headers: { 'Authorization': `Bearer ${TON_API_KEY}` } })

  if (statusText === 'OK') {
    if (data.balances) {
      for (const tokenBalance of data.balances) {
        if (tokenBalance.jetton_address === rawJettonAddress) {
          return toFriendlyAddress(tokenBalance.wallet_address.address)
        }
      }
    }
  }

  return ''
}