import axios from 'axios'

export async function getNftContent({ address }) {
  try {
    const response = await axios.get(`https://api.ton.cat/v2/contracts/nft/nft_item/${address}`)
    const nftData = response?.data
    const isNFT = nftData?.type === 'nft_item'
    if (!isNFT) return null

    const nftMetadataUrl = nftData?.nft_item?.content_url

    const data = {
      index: nftData.nft_item.index,
      itemAddress: nftData.nft_item.item_address,
      collectionAddress: nftData.nft_item.collection_address,
      uri: nftData.nft_item.content_url,
    }

    if (nftMetadataUrl) {
      const responseItem = await axios.get(nftMetadataUrl)
      data.metadata = responseItem.data
    }

    return data
  } catch (e) {
    console.log(e)
    return null
  }
}