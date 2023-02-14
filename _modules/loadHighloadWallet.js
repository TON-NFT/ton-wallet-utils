import { keyPairFromSeed } from 'ton-crypto'
import { Wallets } from 'ton3-contracts'
import { loadHighloadWallet } from './loadHighloadWallet.js'

export async function loadHighloadWallet({ seed }) {
  const seedBuffer = Buffer.from(seed, 'hex')
  const { publicKey, secretKey } = keyPairFromSeed(seedBuffer)
  const wallet = new Wallets.ContractHighloadWalletV2(0, publicKey, 1)
  const address = wallet.address.toString('base64', { bounceable: true, urlSafe: true, workchain: 0 })
  const addressNonBouncable = wallet.address.toString('base64', { bounceable: false, urlSafe: true, workchain: 0 })
  return { address, addressNonBouncable, publicKey, secretKey, wallet }
}