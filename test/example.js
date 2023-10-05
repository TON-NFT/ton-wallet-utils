import {
  config,
  shortAddress,
  flipAddressBouncableType,
  getBalance,
  getFloor,
  getDomain,
  getJettons,
  getNfts,
  getNftContent,
  createWallet,
  getTransactions,
  startTonLiteServer,
  transferNft,
  getDomainDate,
  getNftsFromScaleton,
  getTonPrice,
  refreshGetgemsMetadata,
  whoIsAddress
} from '../index.js'

const { KNOWN_COLLECTIONS } = config

const address = 'EQAd_LCfdJb_Iqz5ZOfyMI9bmJfU_Fz2SN-Gx3wcG33d2tiz'

const client = await startTonLiteServer()
const mc = await client.getMasterchainInfoExt()
const block = mc.last
const shortAddressExample = shortAddress(address)
const balance = await getBalance({ address })
const floor = await getFloor({ address: KNOWN_COLLECTIONS.whales })
const domain = await getDomain({ address: 'EQC2iEJwOsEOptMwwiH57UBJW0B2LmXiBZP5bS_4i-lN6Js6' })
const jettons = await getJettons({ address })
const nfts = await getNfts({ address })
const nfts2 = await getNftsFromScaleton({ address })
const nftData = await getNftContent({ address: 'EQDnMTsgio_GtNKZjD1Ow6N6sAfJY_DBk-ClC-WSsvvo7YCP' })
const regularWallet = await createWallet({ type: 'v4R2' })
const highloadWallet = await createWallet({ type: 'highload' })
const transactions = await getTransactions({ address })
const tonPrice = await getTonPrice()
const refresh = await refreshGetgemsMetadata({ address: 'EQDnMTsgio_GtNKZjD1Ow6N6sAfJY_DBk-ClC-WSsvvo7YCP' })
const whois = await whoIsAddress('EQCtiv7PrMJImWiF2L5oJCgPnzp-VML2CAt5cbn1VsKAxLiE')
const domainDate = await getDomainDate({ address: 'EQD6doIj7gRnw160Bc-fSKEs641wVFDHTROkOt__j4ykiU2o' })
const flippedBouncable = flipAddressBouncableType(address)

// const data = {
//   version: 'v4R2',
//   senderAddress: 'EQC38w2KwRuFLpXylTTgo_Gul3G-ooUMxKpIb9wlKOxRSBeu',
//   senderMnemonic: [],
//   receiverAddress: 'EQAd_LCfdJb_Iqz5ZOfyMI9bmJfU_Fz2SN-Gx3wcG33d2tiz',
//   nftAddress: 'EQApfnmB1OSE6MyKIAieFYze8eJxumRmKLGt5QTMqsXaXMY0',
//   nftCollectionAddress: 'EQC-WYWY1Fo6wK7Alhr_F1cuiki4vuMQhDO_EWnZuWGX3Hk7',
//   nftIndex: 1986
// }

// const result = await transferNft(data)
// console.log(result)

console.log({ refresh, whois, floor, jettons, nfts, nfts2, domain, balance, shortAddressExample, nftData, regularWallet, highloadWallet, transactions, tonPrice, domainDate, flippedBouncable })
process.exit(0)