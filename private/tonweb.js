import TonWeb from 'tonweb'
import tonMnemonic from 'tonweb-mnemonic'

import { TONCENTER_API_KEY, TONCENTER_RPC } from './config.js'

const tonweb = new TonWeb(new TonWeb.HttpProvider(TONCENTER_RPC, { apiKey: TONCENTER_API_KEY }))
const { NftItem } = TonWeb.token.nft

export { TonWeb, NftItem, tonMnemonic, tonweb }