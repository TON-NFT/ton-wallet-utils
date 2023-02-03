import { createWallet, highloadTransfers } from '../main.js'

async function exampleWallet() {
  const { address, seed } = await createWallet({ version: 'highload' })
  console.log({ address, seed })
  process.exit(0)
}

async function exampleTransfer() {
  /* https://tonscan.org/address/EQD2Ub5nOuXcNoXHBhHCRgqn5ytOGS7NjxysRexEQd4sa794  */

  /* Wallet seed and address from exampleWallet, address is to check it is matched with transfers sender wallet */
  const seed = 'c79f8c8a552c45b8ce97ee985cd7e58568186a79a9268dd57be9bae119830ea4'
  const address = 'EQD2Ub5nOuXcNoXHBhHCRgqn5ytOGS7NjxysRexEQd4sa794'
  /* Don't forget to deposit some TONs to the address ↑ */

  /* Put your test transfer here */
  const recipient = 'EQDVmaZ4tfyEWXuIbZdJqmd-NVJdo7IUtj3vom-xWrlFWaNl'
  const sendMessage = 'highload test'
  const tonAmount = 0.001

  /* Amount less than 0.001 TON will likely fail with code -14 */

  /* Safe transfers count is 50, max is 254 per one request */

  /* For provider using ton-lite-server */

  /* Example of multiple transactions in one blockchain request */
  const transfersCount = 10
  const transfers = []
  const transfer = { recipient, sendMessage, tonAmount }
  for (let i = 0; i < transfersCount; i++) transfers.push(transfer)
  await highloadTransfers({ transfers, seed })
  process.exit(0)
}

exampleWallet()
// exampleTransfer()