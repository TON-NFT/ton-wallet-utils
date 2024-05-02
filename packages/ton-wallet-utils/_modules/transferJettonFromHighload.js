import { Address, BOC, Coins, Builder } from "ton3-core";
import { loadHighloadWallet } from "./loadHighloadWallet.js";
import { startTonLiteServer } from "./startTonLiteServer.js";

/* Example of multiple transactions in one blockchain request */
/*
  const seed = `your_highload_wallet_seed, can be generated with createWallet({ type: 'highload' }) or highload.ton.beauty`
  const transfers = [
    {
      responseAddress: 'EQA-b1n3W9GfuEJZKRoYrW9H9209YWt67rTZXlioqbMxbq_v',
      toAddress: 'EQC38w2KwRuFLpXylTTgo_Gul3G-ooUMxKpIb9wlKOxRSBeu',
      jettonWalletAddress: 'EQAElq2cOtQwB1ZsC5L5AAnl1vPUA_-wRqi_gSJEJDyst94x',
      jettonAmount: 10,
      forwardPayload: 'Hello, world!',
    }
  ]
*/

export async function transferJettonFromHighload({
  transfers = [],
  seed,
  client,
}) {
  if (!client) client = await startTonLiteServer();
  if (!seed) return console.error("Seed is required");
  if (!transfers?.length) return console.error("Transfers are required");
  if (transfers.length > 254)
    return console.error("Max 254 transfers per request");

  const { wallet, address, secretKey } = await loadHighloadWallet({ seed });

  const transactions = [];

  for (const transfer of transfers) {
    const tx = await mapTransfer(transfer);
    transactions.push(tx);
  }

  try {
    const message = wallet.createTransferMessage(transactions, true);
    const signed = message.sign(secretKey);
    const payload = new BOC([signed]).toBytes();
    const result = await client.sendMessage(payload);
    return result;
  } catch (e) {
    console.log(
      `Error while sending TON from: ${address}, maybe balance is not enough or address doesn't match?`
    );
    throw e;
  }
}

function chunkSubstr(str, size) {
  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size);
  }

  return chunks;
}

function writeComment(commentParts, i, maxSize) {
  if (i == maxSize) return 0;
  let currentCell;
  const nextInnerCell = writeComment(commentParts, i + 1, maxSize);
  if (nextInnerCell == 0)
    currentCell = new Builder().storeString(commentParts[i]).cell();
  else
    currentCell = new Builder()
      .storeString(commentParts[i])
      .storeRef(nextInnerCell)
      .cell();
  return currentCell;
}

export async function mapTransfer({
  responseAddress,
  toAddress,
  jettonWalletAddress,
  forwardPayload,
  jettonAmount,
}) {
  const tonAmount = 0.05;
  const mode = 3;
  const recipient = jettonWalletAddress;
  const amount = new Coins(tonAmount, { decimals: 9 });
  const destination = new Address(recipient);
  let comment = new Builder();
  const commentParts = chunkSubstr(forwardPayload, 127);
  comment = comment.storeString(commentParts[0]);

  if (commentParts.length > 1) {
    comment = comment.storeRef(
      writeComment(commentParts, 1, commentParts.length)
    );
  }

  comment = comment.cell();

  const body = new Builder()
    .storeUint(0xf8a7ea5, 32)
    .storeUint(0, 64)
    .storeCoins(new Coins(jettonAmount, { decimals: 9 }))
    .storeAddress(new Address(toAddress))
    .storeAddress(new Address(responseAddress))
    .storeUint(0, 1)
    .storeCoins(new Coins(0.01, { decimals: 9 }))
    .storeUint(0, 1)
    .storeUint(0, 32)
    .storeRef(comment)
    .cell();

  return { destination, amount, mode, body };
}
