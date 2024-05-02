import { getJettons } from './getJettons.js'

export async function getJettonBalance({ address, jettonAddress }) {
  const jettons = await getJettons({ address })
  const jetton = jettons.find(jetton => jetton.jetton_address === jettonAddress)
  return jetton?.balance || 0
}