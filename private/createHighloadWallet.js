import { keyPairFromSeed, getSecureRandomBytes } from 'ton-crypto'
import pkg from 'ton3-contracts'
const { Wallets } = pkg

export async function createHighloadWallet() {
  let seed = await getSecureRandomBytes(32)
  const { publicKey, secretKey } = keyPairFromSeed(seed)
  const wallet = new Wallets.ContractHighloadWalletV2(0, publicKey, 1)
  const address = wallet.address.toString('base64', { bounceable: true, urlSafe: true, workchain: 0 })
  const addressNonBouncable = wallet.address.toString('base64', { bounceable: false, urlSafe: true, workchain: 0 })
  // console.log(`Please, deposit some TON to your new wallet ${address}`)
  seed = seed.toString('hex')
  return { address, addressNonBouncable, seed, publicKey, secretKey }
}