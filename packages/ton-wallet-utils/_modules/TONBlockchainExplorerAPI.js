export class TONBlockchainExplorerAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.headers = {
      "X-API-KEY": this.apiKey,
      "Content-Type": "application/json",
    };
    this.baseUrl = "https://tonapi.io/v2/";
  }

  async _makeRequest(endpoint, params) {
    const url = this.baseUrl + endpoint;
    let response = await fetch(url, {
      method: "GET",
      headers: this.headers,
      params: params,
    });
    if (response.status === 429) {
      const retryAfter = parseInt(response.headers.get("Retry-After")) || 1;
      await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
      return await this._makeRequest(endpoint, params);
    }
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  }

  async getJettonHolders(accountId, limit = 1000, offset = 0) {
    const addresses = [];
    let params = { limit: limit, offset: offset };
    console.log("Starting with fetching jetton holders, limit: ", limit);
    while (true) {
      const response = await this._makeRequest(
        `jettons/${accountId}/holders`,
        params
      );
      addresses.push(...(response.addresses || []));
      console.log("pushed ", response.addresses.length, " addresses");
      if ((response.addresses || []).length >= params.limit) {
        break;
      }
      offset += limit;
      params.offset = offset;
    }
    return addresses;
  }

  async getAccountInfo(accountId) {
    const endpoint = `accounts/${accountId}`;
    return await this._makeRequest(endpoint);
  }

  async parseAddress(accountId) {
    const endpoint = `address/${accountId}/parse`;
    return await this._makeRequest(endpoint);
  }
}
