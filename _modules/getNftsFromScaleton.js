import fetch from 'node-fetch'
import { getDomain } from './getDomain.js'
import { KNOWN_COLLECTIONS } from '../private/config.js'

/*  Get first 50 NFTs from Scaleton API */
export async function getNftsFromScaleton({ address }) {
  const url = `https://api.scaleton.io/v1/accounts/${address}/nfts`

  try {
    const response = await fetch(url, options)
    const responseJSON = await response.json()
    const nfts = await mapNFTs(responseJSON.items)
    return { error: false, nfts }
  } catch(e) {
    console.log(e?.response?.statusText || e)
    return { error: true, nfts: [] }
  }
}

async function mapNFTs(nfts) {
  return await Promise.all(nfts.map(async(nft) => {
    if (nft.collectionAddress) {
      nft.getgemsCollectionUrl = `https://getgems.io/collection/${nft.collectionAddress}`
      nft.getgemsNftUrl = `https://getgems.io/collection/${nft.collectionAddress}/${nft.address}`
    } else {
      nft.getgemsNftUrl = `https://getgems.io/nft/${nft.address}`
    }

    nft.custom = {}

    if (nft.collectionAddress === KNOWN_COLLECTIONS.diamond) {
      nft.custom.isDiamondsCollection = true
    }

    if (nft.collectionAddress === KNOWN_COLLECTIONS.domains) {
      nft.custom.domain = await getDomain({ address: nft.address })
      nft.custom.isDomainsCollection = true
    }

    if (nft.collectionAddress === KNOWN_COLLECTIONS.whales) {
      nft.custom.isWhalesCollection = true
    }

    return nft
  }))
}