import { createHighloadWallet } from './createHighloadWallet.js'
import { VERSION_TYPES } from '../private/config.js'
import { tonMnemonic, tonweb } from '../private/tonweb.js'

export async function createWallet({ version = 'v4R2' }) {
  if (version === VERSION_TYPES.highload) return await createHighloadWallet()
  if (version === VERSION_TYPES.v4R2) return await createRegularWallet()
  return { error: 'Unknown version' }
}

async function createRegularWallet() {
  const mnemonic = await tonMnemonic.generateMnemonic()
  const keyPair = await tonMnemonic.mnemonicToKeyPair(mnemonic)
  const { publicKey, secretKey } = keyPair
  const wallet = tonweb.wallet.create({ publicKey })
  const addr = await wallet.getAddress()
  const address = addr.toString(true, true, true, false)
  const addressNonBouncable = addr.toString(true, true, false, false)
  return { address, addressNonBouncable, mnemonic, publicKey, secretKey, wallet }
}