import { createHighloadWallet } from './createHighloadWallet.js'
import { VERSION_TYPES } from '../private/config.js'
import { tonMnemonic, tonweb } from '../private/tonweb.js'

export async function createWallet({ version = 'v4R2' }) {
  if (version === VERSION_TYPES.highload) return await createHighloadWallet()
  const isRegularWallet = Object.values(VERSION_TYPES).includes(version)
  if (isRegularWallet) return await createRegularWallet({ version })
  return { error: 'Unknown version' }
}

async function createRegularWallet({ version }) {
  const mnemonic = await tonMnemonic.generateMnemonic()
  const keyPair = await tonMnemonic.mnemonicToKeyPair(mnemonic)
  const { publicKey, secretKey } = keyPair
  const WalletClass = tonweb.wallet.all[version]
  const wallet = new WalletClass(tonweb.provider, { publicKey, wc: 0 })
  const addr = await wallet.getAddress()
  const address = addr.toString(true, true, true, false)
  const addressNonBouncable = addr.toString(true, true, false, false)
  return { address, addressNonBouncable, mnemonic, publicKey, secretKey, wallet }
}