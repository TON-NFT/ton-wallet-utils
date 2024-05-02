import fetch, { Headers } from "node-fetch";
import { flipAddressType } from "./utils.js";
import { TON_API_KEY, IPFS_GATEWAY } from "../private/config.js";

export async function getJettons({ address, ton_api_key = TON_API_KEY }) {
  const rawAddress = flipAddressType(address);

  const options = {
    method: "GET",
    headers: new Headers({ Authorization: `Bearer ${ton_api_key}` }),
  };

  try {
    const url = `https://tonapi.io/v2/accounts/${rawAddress}/jettons`;
    const response = await fetch(url, options);
    const responseJSON = await response.json();

    let jettons = [];

    if (responseJSON.balances) {
      for (const tokenBalance of responseJSON.balances) {
        tokenBalance.balance = +tokenBalance.balance;

        const url = `https://tonapi.io/v2/jettons/${tokenBalance.jetton_address}`;

        try {
          const responseAboutJetton = await fetch(url, options);
          const responseJSONAboutJetton = await responseAboutJetton.json();

          const tokenBalanceWithInfo = { ...tokenBalance };

          tokenBalanceWithInfo.jetton_info = responseJSONAboutJetton;
          delete tokenBalanceWithInfo.metadata;

          jettons.push(tokenBalanceWithInfo);
        } catch (e) {
          console.log(e.code);
        }
      }

      jettons = jettons.map((jetton) => {
        const a = +`1${"0".repeat(jetton.jetton_info.metadata.decimals)}`;
        jetton.jetton_info.metadata.address = flipAddressType(
          jetton.jetton_info.metadata.address
        );
        jetton.balance = jetton.balance / a;
        jetton.jetton_info.total_supply = +jetton.jetton_info.total_supply / a;
        if (!jetton.jetton_address || !jetton.wallet_address?.address)
          return jetton;
        jetton.jetton_address = flipAddressType(jetton.jetton_address);
        jetton.wallet_address.address = flipAddressType(
          jetton.wallet_address.address
        );
        jetton.jetton_info.metadata.image =
          jetton.jetton_info?.metadata?.image?.replace("ipfs://", IPFS_GATEWAY);
        return jetton;
      });

      return jettons;
    }
  } catch (e) {
    console.log(e.code);
    return [];
  }
}
