import { VERSION_TYPES } from '../private/config.js'
import { tonMnemonic } from '../private/tonweb.js'
import { keyPairFromSeed } from 'ton-crypto'
import { Wallets } from 'ton3-contracts'
import { TonClient } from 'ton'

export async function loadWallet({ version = 'v4R2', mnemonic = [], seed = '' }) {
  let walletType
  switch (version) {
    case VERSION_TYPES.highload:
      return await loadHighloadWallet({ seed })
    case VERSION_TYPES.v3R2:
      walletType = 'org.ton.wallets.v3.r2'
      break
    case VERSION_TYPES.v4R2:
      walletType = 'org.ton.wallets.v4'
      break
    default:
      return { error: 'Unknown version. Please use v3R2, v4R2 or highload' }
  }

  const keyPair = await tonMnemonic.mnemonicToKeyPair(mnemonic)
  const { publicKey, secretKey } = keyPair
  const client = new TonClient({ endpoint: 'https://example.com' })
  const wallet = client.openWalletFromSecretKey({ secretKey: Buffer.from(keyPair.secretKey), workchain: 0, type: walletType })
  const address = wallet.address.toFriendly('base64', { bounceable: true, urlSafe: true, workchain: 0 })
  const nonBouncableAddress = wallet.address.toFriendly('base64', { bounceable: false, urlSafe: true, workchain: 0 })
  return { address, nonBouncableAddress, mnemonic, publicKey, secretKey }
}

export async function loadHighloadWallet({ seed }) {
  const seedBuffer = Buffer.from(seed, 'hex')
  const { publicKey, secretKey } = keyPairFromSeed(seedBuffer)
  const wallet = new Wallets.ContractHighloadWalletV2(0, publicKey, 1)
  const address = wallet.address.toString('base64', { bounceable: true, urlSafe: true, workchain: 0 })
  const addressNonBouncable = wallet.address.toString('base64', { bounceable: false, urlSafe: true, workchain: 0 })
  return { address, addressNonBouncable, publicKey, secretKey }
}