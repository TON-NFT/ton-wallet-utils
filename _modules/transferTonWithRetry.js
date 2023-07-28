import { TonClient, internal, WalletContractV4, WalletContractV3R1, WalletContractV3R2 } from 'ton'
import { mnemonicToPrivateKey } from 'ton-crypto'
import { startTonLiteServer } from './startTonLiteServer.js'

export async function transferTonWithRetry({ mnemonic, version = 'v4R2', address: to, amount, payload: body = '' }) {
  const client = await startTonLiteServer()
  const keyPair = await mnemonicToPrivateKey(mnemonic)
  const { publicKey, secretKey } = keyPair

  /* We are not actually using this endpoint */
  const endpoint = 'https://toncenter.com/api/v2/jsonRPC'
  const clientTon = new TonClient({ endpoint })

  let walletInterface = {}
  if (version === 'v3R1') walletInterface = WalletContractV3R1
  if (version === 'v3R2') walletInterface = WalletContractV3R2
  if (version === 'v4R1') walletInterface = WalletContractV4
  if (version === 'v4R2') walletInterface = WalletContractV4
  if (!walletInterface) throw new Error('Invalid wallet version')

  const workchain = 0
  const wallet = walletInterface.create({ workchain, publicKey })
  const contract = clientTon.open(wallet)

  const NNTN = 1e9
  const value = amount * NNTN
  const t = { value, to, body }
  const messages = [internal(t)]
  const seqno = await contract.getSeqno() || 0
  const signedTransaction = await contract.createTransfer({ seqno, secretKey, messages })

  /* To ensure that the transaction is sent, we send it 5 times */
  for (let i = 0; i < 5; i++) {
    try {
      await client.sendMessage(signedTransaction.toBoc())
    } catch (e) {
      console.log(e)
    }
  }
}