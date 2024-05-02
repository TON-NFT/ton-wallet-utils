import { Address, BOC, Builder, Cell, Coins } from 'ton3-core'
import { keyPairFromSeed } from 'ton-crypto'
import { startTonLiteServer } from './startTonLiteServer.js'
import pkg from 'ton3-contracts'
const { Wallets } = pkg

/* Example of multiple transactions in one blockchain request */
/*
  const seed = `your_highload_wallet_seed, can be generated with createWallet({ type: 'highload' }) or highload.ton.beauty`
  const transfers = [
    { recipient: 'EQDVmaZ4tfyEWXuIbZdJqmd-NVJdo7IUtj3vom-xWrlFWaNl', sendMessage: 'highload test', tonAmount: 0.001 }
  ]
*/

export async function highloadTransfers({ transfers = [], seed, client }) {
  if (!client) client = await startTonLiteServer()
  if (!seed) return console.error('Seed is required')
  if (!transfers?.length) return console.error('Transfers are required')
  if (transfers.length > 254) return console.error('Max 254 transfers per request')

  const seedBuffer = Buffer.from(seed, 'hex')
  const { publicKey, secretKey } = keyPairFromSeed(seedBuffer)
  const wallet = new Wallets.ContractHighloadWalletV2({ publicKey, workchain: 0, subwalletId: 1 })
  const address = wallet.address.toString('base64', { bounceable: true, urlSafe: true, workchain: 0 })

  transfers = transfers.map(mapTransfer)

  try {
    const message = wallet.createTransferMessage(transfers, true)
    const signed = message.sign(secretKey)
    const payload = Buffer.from(BOC.toBytesStandard(signed))
    const repeatForSanity = 10
    let result
    for (let i = 0; i < repeatForSanity; i++) {
      result = await client.sendMessage(payload)
      if (result.result !== 1) console.log(result.result)
      else break
    }
    return result
  } catch (e) {
    console.log(`Error while sending TON from: ${address}, maybe balance is not enough or address doesn't match?`)
    throw e
  }
}

export function mapTransfer({ recipient, sendMessage, tonAmount }) {
  const body = sendMessage ? new Builder().storeUint(0, 32).storeString(sendMessage).cell() : new Cell()
  const mode = 3
  const amount = new Coins(tonAmount, { decimals: 9 })
  const destination = new Address(recipient)
  return { destination, amount, mode, body }
}