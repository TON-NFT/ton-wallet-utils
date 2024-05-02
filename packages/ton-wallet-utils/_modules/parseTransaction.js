import { flipAddressType, NNTN } from './utils.js'

export function parseTransaction(raw_tx = {}) {
  if (!raw_tx || !raw_tx?.in_msg || !raw_tx?.hash || !raw_tx?.utime) return { error: 'Invalid transaction' }
  const { in_msg = {}, hash: hash_hex, lt, utime } = raw_tx

  const ts = utime * 1000

  const bounced = in_msg.bounced

  const hash = Buffer.from(hash_hex, 'hex').toString('base64')

  const tx_receiver = flipAddressType(in_msg.destination?.address)

  const tx_sender = flipAddressType(in_msg.source?.address)

  const amount_nntn = in_msg.value

  const amount = amount_nntn / NNTN || 0

  const ts_date = new Date(ts)
  const ts_now = new Date()

  const seconds_ago = Math.floor((ts_now - ts_date) / 1000)

  const utc_time = ts_date.toUTCString()

  const tx = {
    lt,
    hash,
    hash_hex,
    bounced,
    tx_sender,
    tx_receiver,
    amount,
    seconds_ago,
    utc_time,
    ts
  }

  if (in_msg.destination?.name) tx.tx_receiver_name = in_msg.destination?.name

  if (in_msg.decoded_op_name === 'text_comment') tx.comment = in_msg.decoded_body?.text || ''
  else tx.payload = in_msg.raw_body

  if (!tx.comment) tx.comment = ''

  tx.url = `https://tonscan.org/tx/${tx.hash}`

  return tx
}