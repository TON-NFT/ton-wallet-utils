import { TonClient, WalletContractV3R1, WalletContractV3R2, WalletContractV4 } from 'ton'
import { mnemonicToPrivateKey } from 'ton-crypto'
import TonWeb from 'tonweb'
import { loadHighloadWallet } from './loadHighloadWallet.js'
import { VERSION_TYPES } from '../private/config.js'

export async function loadWallet({ version = 'v4R2', mnemonic = [], seed = '' }) {
  if (version === VERSION_TYPES.highload) return await loadHighloadWallet({ seed })

  const keyPair = await mnemonicToPrivateKey(mnemonic)
  const { publicKey, secretKey } = keyPair

  let walletInterface = {}

  const endpoint = 'https://toncenter.com/api/v2/jsonRPC'
  const clientTon = new TonClient({ endpoint })

  if (version === 'v3R1') walletInterface = WalletContractV3R1
  if (version === 'v3R2') walletInterface = WalletContractV3R2
  if (version === 'v4R1') walletInterface = WalletContractV4
  if (version === 'v4R2') walletInterface = WalletContractV4

  if (!walletInterface) throw new Error('Invalid wallet version')

  const workchain = 0
  const wallet = walletInterface.create({ workchain, publicKey })
  const address = wallet.address.toString()
  const nonBouncableAddress = new TonWeb.utils.Address(address).toString(true, true, false, false)
  const rawAddress = wallet.address.toRawString()
  const provider = clientTon.provider(wallet.address)
  return { address, rawAddress, nonBouncableAddress, provider, mnemonic, publicKey, secretKey, wallet }
}