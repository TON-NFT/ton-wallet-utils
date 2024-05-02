import { tonweb, TonWeb, NftItem, tonMnemonic } from "../private/tonweb.js";

export async function transferNft({
  version = "v4R2",
  senderAddress,
  nftIndex,
  senderMnemonic,
  receiverAddress,
  nftAddress,
  nftCollectionAddress,
}) {
  const newOwnerAddress = new TonWeb.utils.Address(receiverAddress);
  const address = new TonWeb.utils.Address(nftAddress);
  const collectionAddress = new TonWeb.utils.Address(nftCollectionAddress);
  const nftToTransfer = new NftItem(tonweb.provider, {
    index: Number(nftIndex),
    collectionAddress,
    address,
  });
  const queryId = +Date.now();
  const responseAddress = new TonWeb.utils.Address(senderAddress);
  const payload = await nftToTransfer.createTransferBody({
    queryId,
    newOwnerAddress,
    responseAddress,
  });

  const senderKeyPair = await tonMnemonic.mnemonicToKeyPair(senderMnemonic);
  const { publicKey, secretKey } = senderKeyPair;
  const WalletClass = tonweb.wallet.all[version];
  const wallet = new WalletClass(tonweb.provider, { publicKey, wc: 0 });
  const seqno = (await wallet.methods.seqno().call()) || 0;
  const amount = TonWeb.utils.toNano("0.05");
  const sendMode = 3;
  const toAddress = nftAddress.toString(true, true, true);
  const tx = { toAddress, amount, seqno, payload, sendMode, secretKey };
  await wallet.methods.transfer(tx).send();
  return true;
}
