import { startTonLiteServer } from './startTonLiteServer.js'
import { Address, Cell, parseStack } from 'ton'

export async function getDomain({ address }) {
  const client = await startTonLiteServer()
  const mc = await client.getMasterchainInfoExt()
  const currentBlock = mc.last
  const buffer = Buffer.alloc(0)
  const { result } = await client.runMethod(Address.parse(address), 'get_domain', buffer, currentBlock)
  const dataBuffer = Buffer.from(result, 'base64')
  const cell = Cell.fromBoc(dataBuffer)[0]
  const stack = parseStack(cell)
  const arg1 = stack[0]
  const slice = arg1.cell.beginParse()
  const bitString = slice['bits'].buffer
  const domain = new TextDecoder().decode(bitString).replace(/\x00/g, '')
  return `${domain}.ton`
}