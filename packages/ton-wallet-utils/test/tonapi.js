import { getTransaction } from '../_modules/getTransaction.js'
import { getTransactions } from '../_modules/getTransactions.js'
import { parseTransaction } from '../_modules/parseTransaction.js'

const TON_API_TOKEN = ''

let { transactions } = await getTransactions({ address: 'EQAd_LCfdJb_Iqz5ZOfyMI9bmJfU_Fz2SN-Gx3wcG33d2tiz', limit: 10, TON_API_TOKEN })

transactions = transactions.map(parseTransaction)

console.log(transactions)