import fetch from "node-fetch";

export async function getTransaction({ hash, TON_API_TOKEN = "" }) {
  const headers = {};

  if (TON_API_TOKEN) headers["Authorization"] = `Bearer ${TON_API_TOKEN}`;

  try {
    const result = await fetch(
      `https://tonapi.io/v2/blockchain/transactions/${hash}`,
      { headers }
    );
    const data = await result.json();
    if (data?.error) throw new Error("Invalid response");
    return data;
  } catch (e) {
    return { error: e };
  }
}
