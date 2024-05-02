import fetch from "node-fetch";

export async function getNftContent({ address }) {
  try {
    const url = `https://api.ton.cat/v2/contracts/nft/nft_item/${address}`;
    const options = { method: "GET" };
    const response = await fetch(url, options);
    const responseJSON = await response.json();

    const isNFT = responseJSON?.type === "nft_item";
    if (!isNFT) return null;

    const nft_item = responseJSON.nft_item;

    const nftMetadataUrl = nft_item.content_url;

    const data = {
      index: nft_item.index,
      itemAddress: nft_item.item_address,
      collectionAddress: nft_item.collection_address,
      uri: nft_item.content_url,
    };

    if (nftMetadataUrl) {
      try {
        const response = await fetch(nftMetadataUrl, options);
        const responseJSON = await response.json();
        data.metadata = responseJSON;
      } catch (e) {
        console.log(e);
      }
    }

    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
}
