import { startTonLiteServer } from './startTonLiteServer.js'
import { Address, Cell, parseTuple } from '@ton/ton'

export async function getDomain({ address }) {
  const client = await startTonLiteServer()
  const mc = await client.getMasterchainInfoExt()
  const currentBlock = mc.last
  const buffer = Buffer.alloc(0)
  const { result } = await client.runMethod(Address.parse(address), 'get_domain', buffer, currentBlock)
  const dataBuffer = Buffer.from(result, 'base64')
  const cell = Cell.fromBoc(dataBuffer)[0]
  const [domainItem] = parseTuple(cell)
  const slice = domainItem.cell.beginParse()
  const domain = slice.loadBuffer(slice.remainingBits / 8).toString('ascii')
  return `${domain}.ton`
}