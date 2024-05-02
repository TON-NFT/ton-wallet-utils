import {
  Address,
  Cell,
  TonClient,
  WalletContractV3R1,
  WalletContractV3R2,
  WalletContractV4,
} from "@ton/ton";
import { mnemonicToPrivateKey } from "ton-crypto";
import TonWeb from "tonweb";
import { loadHighloadWallet } from "./loadHighloadWallet.js";
import {
  TONCENTER_API_KEY,
  TONCENTER_RPC,
  VERSION_TYPES,
} from "../private/config.js";

export async function loadWallet({
  version = VERSION_TYPES.v4R2,
  mnemonic = [],
  seed = "",
}) {
  if (version === VERSION_TYPES.highload)
    return await loadHighloadWallet({ seed });

  const keyPair = await mnemonicToPrivateKey(mnemonic);
  const { publicKey, secretKey } = keyPair;

  const clientTon = new TonClient({
    endpoint: TONCENTER_RPC,
    apiKey: TONCENTER_API_KEY,
  });

  let walletInterface = {};
  if (version === VERSION_TYPES.v3R1) walletInterface = WalletContractV3R1;
  if (version === VERSION_TYPES.v3R2) walletInterface = WalletContractV3R2;
  if (version === VERSION_TYPES.v4R1) walletInterface = WalletContractV4;
  if (version === VERSION_TYPES.v4R2) walletInterface = WalletContractV4;
  if (!walletInterface) throw new Error("Invalid wallet version");

  const workchain = 0;
  const wallet = walletInterface.create({ workchain, publicKey });
  const address = wallet.address.toString();
  const nonBouncableAddress = new TonWeb.utils.Address(address).toString(
    true,
    true,
    false,
    false
  );
  const rawAddress = wallet.address.toRawString();
  const addr = Address.parseRaw(rawAddress);
  const code = new Cell();
  const data = new Cell();
  const provider = clientTon.provider(addr, { code, data });
  return {
    address,
    rawAddress,
    nonBouncableAddress,
    provider,
    mnemonic,
    publicKey,
    secretKey,
    wallet,
  };
}
