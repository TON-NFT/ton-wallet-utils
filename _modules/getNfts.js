import axios from 'axios'
import { flipAddressType } from './utils.js'
import { getDomain } from './getDomain.js'
import { KNOWN_COLLECTIONS, IPFS_GATEWAY, TON_API_KEY } from '../private/config.js'

export async function getNfts({ address }) {
  const rawAddress = flipAddressType(address)
  const url = `https://tonapi.io/v2/nft/getItemsByOwnerAddress?account=${rawAddress}`
  try {
    const { statusText, data } = await axios.get(url, { headers: { 'Authorization': `Bearer ${TON_API_KEY}` } })
    if (statusText !== 'OK') return { error: true, nfts: [] }
    const nfts = await mapNFTs(data.nft_items)
    for (const n of nfts.filter(nft => !nft.metadata)) {
      console.log(`No metadata at NFT ${n.address}`)
    }
    return { error: false, nfts }
  } catch(e) {
    console.log(e?.response?.statusText || e)
    return { error: true, nfts: [] }
  }
}

async function mapNFTs(nfts) {
  return await Promise.all(nfts.map(async(nft) => {
    const isSingleNFT = !nft.collection_address

    nft.address = flipAddressType(nft.address)
    nft.imageUrl = nft?.metadata?.image

    if (nft.imageUrl?.startsWith('ipfs://')) nft.imageUrl = nft.imageUrl?.replace('ipfs://', IPFS_GATEWAY)

    if (!isSingleNFT) {
      if (nft.collection_address) {
        nft.collectionAddress = flipAddressType(nft.collection_address)
        delete nft.collection_address
      }
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