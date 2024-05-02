import { transferJettonFromHighload } from '../_modules/transferJettonFromHighload.js'

const seed = 'cc4fc19c5f90ee718ec279c38f6cf1524062a6b49b6c34ecc5b54c4edae25c3f'

const tx1 = {
  responseAddress: 'EQA-b1n3W9GfuEJZKRoYrW9H9209YWt67rTZXlioqbMxbq_v',
  toAddress: 'EQC38w2KwRuFLpXylTTgo_Gul3G-ooUMxKpIb9wlKOxRSBeu',
  jettonWalletAddress: 'EQAElq2cOtQwB1ZsC5L5AAnl1vPUA_-wRqi_gSJEJDyst94x',
  forwardPayload: '1423423423423423423423423423423423423423432423423432432423423423423424234234234234234234232423424243423432424',
  jettonAmount: 1,
}

const tx2 = {
  responseAddress: 'EQA-b1n3W9GfuEJZKRoYrW9H9209YWt67rTZXlioqbMxbq_v',
  toAddress: 'EQC38w2KwRuFLpXylTTgo_Gul3G-ooUMxKpIb9wlKOxRSBeu',
  jettonWalletAddress: 'EQAElq2cOtQwB1ZsC5L5AAnl1vPUA_-wRqi_gSJEJDyst94x',
  forwardPayload: '2423423423423423423423423423423423423423432423423432432423423423423424234234234234234234232423424243423432424',
  jettonAmount: 2,
}

const transfers = [tx1, tx2]

const result = await transferJettonFromHighload({ transfers, seed })
console.log(result)