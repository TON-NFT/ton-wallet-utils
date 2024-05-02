import fetch from 'node-fetch'
import { IPFS_GATEWAY } from '../private/config.js'

export async function getCollection({ address }) {
  try {
    const url = `https://api.ton.cat/v2/contracts/nft_collection/${address}`
    const response = await fetch(url, options)
    const responseJSON = await response.json()

    const isNFT = responseJSON?.type === 'nft_collection'
    if (!isNFT) return null
    const collectionData = responseJSON.nft_collection

    const replaceIpfs = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object') {
          replaceIpfs(obj[key])
        } else if (typeof obj[key] === 'string' && obj[key].startsWith('ipfs://')) {
          obj[key] = obj[key].replace('ipfs://', IPFS_GATEWAY)
        }
      }
    }

    replaceIpfs(collectionData)

    return { error: false, collectionData }
  } catch (e) {
    console.log(e?.response?.statusText || e)
    return { error: true, collectionData: {} }
  }
}