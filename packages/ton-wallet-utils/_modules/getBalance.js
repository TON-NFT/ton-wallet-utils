import fetch, { Headers } from "node-fetch";
import { NNTN, TON_API_KEY } from "../private/config.js";

export async function getBalance({ address, ton_api_key = TON_API_KEY }) {
  const options = {
    method: "GET",
    headers: new Headers({ Authorization: `Bearer ${ton_api_key}` }),
  };
  const response = await fetch(
    `https://tonapi.io/v2/blockchain/accounts/${address}`,
    options
  );
  const userData = await response.json();
  const balance = userData?.balance / NNTN || 0;
  return balance;
}
