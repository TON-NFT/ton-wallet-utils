import { TonClient, internal, WalletContractV4, WalletContractV3R1, WalletContractV3R2 } from 'ton'
import { mnemonicToPrivateKey } from 'ton-crypto'
import { getHttpEndpoint } from '@orbs-network/ton-access'


export async function transferTonWithOrbs({ mnemonic, version = 'v4R2', address: to, amount, payload: body = '' }) {
  const endpoint = await getHttpEndpoint()
  const client = new TonClient({ endpoint })
  const keyPair = await mnemonicToPrivateKey(mnemonic)
  const { publicKey, secretKey } = keyPair
  let walletInterface = {}
  if (version === 'v3R1') walletInterface = WalletContractV3R1
  if (version === 'v3R2') walletInterface = WalletContractV3R2
  if (version === 'v4R1') walletInterface = WalletContractV4
  if (version === 'v4R2') walletInterface = WalletContractV4
  if (!walletInterface) throw new Error('Invalid wallet version')
  const workchain = 0
  const wallet = walletInterface.create({ workchain, publicKey })
  const contract = client.open(wallet)
  const NNTN = 1e9
  const value = amount * NNTN
  const t = { value, to, body }
  const messages = [internal(t)]
  const seqno = await contract.getSeqno() || 0
  return await contract.sendTransfer({ seqno, secretKey, messages })
}