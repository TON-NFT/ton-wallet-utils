import { TON_API_KEY } from "../private/config.js";
import { tonweb, tonMnemonic } from "../private/tonweb.js";
import { toFriendlyAddress, toRawAddress } from "./utils.js";

export async function getJettonWalletAddress({
  jettonAddress,
  walletAddress,
  mnemonic,
  version = "v4R2",
  ton_api_key = TON_API_KEY,
}) {
  if (!walletAddress) {
    const keyPair = await tonMnemonic.mnemonicToKeyPair(mnemonic);
    const { publicKey } = keyPair;
    const WalletClass = tonweb.wallet.all[version];
    const wallet = new WalletClass(tonweb.provider, { publicKey, wc: 0 });
    const addr = await wallet.getAddress();
    walletAddress = addr.toString(true, true, true, false);
  }

  const rawAddress = toRawAddress(walletAddress);
  const rawJettonAddress = toRawAddress(jettonAddress);

  const url = `https://tonapi.io/v2/accounts/${rawAddress}/jettons`;
  const options = {
    method: "GET",
    headers: new Headers({ Authorization: `Bearer ${ton_api_key}` }),
  };

  try {
    const response = await fetch(url, options);
    const responseJSON = await response.json();

    if (responseJSON?.balances) {
      for (const tokenBalance of responseJSON.balances) {
        if (tokenBalance.jetton_address === rawJettonAddress) {
          return toFriendlyAddress(tokenBalance.wallet_address.address);
        }
      }
    }
  } catch (e) {
    console.log(e.code);
  }

  return "";
}
