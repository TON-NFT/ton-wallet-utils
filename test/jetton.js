import { transferJetton } from '../_modules/transferJetton.js'
import { getJettons } from '../_modules/getJettons.js'
import { getJettonBalance } from '../_modules/getJettonBalance.js'

/* -------------- Transfer -------------- */

const jettonAddress = 'EQCkY5lzigSfWq_JMfvKQ94b3n00UZ12QTc2aW9OgZ7xma90'
const toAddress = 'EQDVmaZ4tfyEWXuIbZdJqmd-NVJdo7IUtj3vom-xWrlFWaNl'
const amount = 50
const mnemonic = []
const version = 'v4R2'
const payload = 'Gift!'

const data = { jettonAddress, toAddress, amount, mnemonic, version, payload }

const transferResult = await transferJetton(data)
console.log(transferResult)

/* -------------- Get all -------------- */

// const jettons = await getJettons({ address })
// console.log(jettons)

/* -------------- Get balance -------------- */

// const address = 'UQAkw9z95hL-kI3L0BrHVf0FSxCP8beek_H60lyJ4M33uUTo'
// const jettonAddress = 'EQCkY5lzigSfWq_JMfvKQ94b3n00UZ12QTc2aW9OgZ7xma90'
// const jettonBalance = await getJettonBalance({ address, jettonAddress })
// console.log(jettonBalance)

// ---------------------------------------------