import { tonweb, TonWeb, tonMnemonic } from "../private/tonweb.js";
import { getJettonWalletAddress } from "./getJettonWalletAddress.js";
const { JettonWallet } = TonWeb.token.jetton;

/* jettonAddress or jettonWalletAddress required, fromAddress is not required */
export async function transferJetton({
  jettonAddress,
  jettonWalletAddress,
  toAddress,
  fromAddress,
  amount,
  mnemonic,
  version = "v4R2",
  payload = "",
}) {
  if (!jettonWalletAddress)
    jettonWalletAddress = await getJettonWalletAddress({
      jettonAddress,
      walletAddress: fromAddress,
      mnemonic,
      version,
    });

  if (!jettonWalletAddress)
    throw new Error(
      "Jetton wallet address not found, please pass it or at least pass jettonAddress and mnemonic"
    );

  const keyPair = await tonMnemonic.mnemonicToKeyPair(mnemonic);
  const { publicKey, secretKey } = keyPair;
  const WalletClass = tonweb.wallet.all[version];
  const wallet = new WalletClass(tonweb.provider, { publicKey, wc: 0 });
  const addr = await wallet.getAddress();
  const responseAddress = addr.toString(true, true, true, false);

  const seqno = (await wallet.methods.seqno().call()) || 0;

  const jettonWallet = new JettonWallet(tonweb.provider, {
    address: jettonWalletAddress,
  });

  const transferBodyParams = {
    jettonAmount: TonWeb.utils.toNano(String(amount)),
    toAddress: new TonWeb.utils.Address(toAddress),
    forwardAmount: TonWeb.utils.toNano("0.01"),
    forwardPayload: new TextEncoder().encode(payload),
    responseAddress: new TonWeb.utils.Address(responseAddress),
  };

  {
    const payload = await jettonWallet.createTransferBody(transferBodyParams);

    const tx = {
      secretKey,
      toAddress: jettonWalletAddress,
      amount: TonWeb.utils.toNano("0.05"),
      seqno,
      payload,
      sendMode: 3,
    };

    try {
      return await wallet.methods.transfer(tx).send();
    } catch (error) {
      throw new Error(error);
    }
  }
}
