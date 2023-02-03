import { tonweb, TonWeb, tonMnemonic } from '../private/tonweb.js'

export async function transferTon({ mnemonic, version = 'v4R2', address: toAddress, amount: amountTON, payload = '' }) {
  const keyPair = await tonMnemonic.mnemonicToKeyPair(mnemonic)
  const { publicKey, secretKey } = keyPair
  const WalletClass = tonweb.wallet.all[version]
  const wallet = new WalletClass(tonweb.provider, { publicKey, wc: 0 })
  const seqno = (await wallet.methods.seqno().call()) || 0
  const amount = TonWeb.utils.toNano(String(amountTON))
  const sendMode = 3
  const tx = { secretKey, toAddress, amount, seqno, payload, sendMode }
  try {
    return await wallet.methods.transfer(tx).send()
  } catch (error) {
    throw new Error(error)
  }
}