import { Address } from "@ton/ton";
import { startTonLiteServer } from "./startTonLiteServer.js";

export async function getTransactionsLiteServer({ address }) {
  const client = await startTonLiteServer();
  const mc = await client.getMasterchainInfoExt();
  const block = mc.last;

  const state = await client.getAccountState(Address.parse(address), block);
  const transactions = await client.getAccountTransactions(
    Address.parse(address),
    state.lastTx?.lt,
    state.lastTx?.hash,
    10
  );

  return transactions || [];
}
