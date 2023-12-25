export const KNOWN_COLLECTIONS = {
  diamond: 'EQAG2BH0JlmFkbMrLEnyn2bIITaOSssd4WdisE4BdFMkZbir',
  domains: 'EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz',
  whales: 'EQDvRFMYLdxmvY3Tk-cfWMLqDnXF_EclO2Fp4wwj33WhlNFT',
  foxtails: 'EQDjfz9lwxZ9fG1YKijZfuAKF6xmD5YVbzxLb6njY4C9suta',
  false_gems: 'EQBwATR_oKxj7i3i_8WkkqKJQ3IrdO4lw0tSILPV_TDt6-De',
}

export const VERSION_TYPES = {
  highload: 'highload',
  v4R2: 'v4R2',
  v4R1: 'v4R1',
  v3R1: 'v3R1',
  v3R2: 'v3R2',
}

export const TON_API_KEY = `eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsidGcwOUY5Il0sImV4cCI6MTgxNjIwMjE3NCwiaXNzIjoiQHRvbmFwaV9ib3QiLCJqdGkiOiI1VTU1VjdVVEUzQk1OMzdYVk1EWVYzSUYiLCJzY29wZSI6InNlcnZlciIsInN1YiI6InRvbmFwaSJ9.tDG3J0wdqIYs1P227m2YeaMk_18CrOw7mE1TYBQ7wVTCCz9WVdx7OI4zX9bL7EvlzdrEzWOG9qma1RpC4V_oCQ`
export const TON_API_URL = 'https://tonapi.io/v2/blockchain/getAccount?'
export const NNTN = 1000000000
export const WALLET_LENGTH = 48

export const IPFS_GATEWAY = 'https://custom.infura-ipfs.io/ipfs/'
// 'https://gateway.pinata.cloud/ipfs/'

export const GET_HEADERS = BEARER_TOKEN => ({ headers: { Authorization: `Bearer ${BEARER_TOKEN}`, 'Content-Type': 'application/json' } })

export const TONCENTER_API_KEY = '1ea4111fd2daf896d3e79eb11e1537724faef703a11b836186316fdd610dd60a'
export const TONCENTER_RPC = 'https://toncenter.com/api/v2/jsonRPC'

export const NODES_INFO = 'https://ton-blockchain.github.io/global.config.json'

export const WHALES_POOLS = {
  PUBLIC_1: 'EQCkR1cGmnsE45N4K0otPl5EnxnRakmGqeJUNua5fkWhales',
  PUBLIC_2: 'EQCY4M6TZYnOMnGBQlqi_nyeaIB1LeBFfGgP4uXQ1VWhales',
  CLUB_1: 'EQDFvnxuyA2ogNPOoEj1lu968U4PP8_FzJfrOWUsi_o1CLUB',
  CLUB_2: 'EQA_cc5tIQ4haNbMVFUD1d0bNRt17S7wgWEqfP_xEaTACLUB',
  TEAM_1: 'EQCOj4wEjXUR59Kq0KeXUJouY5iAcujkmwJGsYX7qPnITEAM',
  TEAM_2: 'EQBI-wGVp_x0VFEjd7m9cEUD3tJ_bnxMSp0Tb9qz757ATEAM',
}