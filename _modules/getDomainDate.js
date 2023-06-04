import { startTonLiteServer } from './startTonLiteServer.js'
import { Address, Cell, parseStack } from 'ton'

export async function getDomainDate({ address }) {
  const client = await startTonLiteServer()
  const mc = await client.getMasterchainInfoExt()
  const currentBlock = mc.last
  const buffer = Buffer.alloc(0)
  const { result } = await client.runMethod(Address.parse(address), 'get_last_fill_up_time', buffer, currentBlock)
  const dataBuffer = Buffer.from(result, 'base64')
  const cell = Cell.fromBoc(dataBuffer)[0]
  const stack = parseStack(cell)
  const arg1 = stack[0]
  const date = new Date(arg1.value * 1000)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const minutes = date.getMinutes()
  const hours = date.getHours()
  const seconds = date.getSeconds()

  const expiredDay = day
  const expiredMonth = month
  const expiredYear = year + 1
  const expiredMinutes = minutes
  const expiredHours = hours
  const expiredSeconds = seconds

  date.setFullYear(expiredYear)

  const now = new Date()

  const timeDiff = date - now

  const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hoursLeft = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
  const secondsLeft = Math.floor((timeDiff % (1000 * 60)) / 1000)

  const last_payment = { day, month, year, minutes, hours, seconds }
  const expired_at = { day: expiredDay, month: expiredMonth, year: expiredYear, minutes: expiredMinutes, hours: expiredHours, seconds: expiredSeconds }
  const till_expired = { daysLeft, hoursLeft, minutesLeft, secondsLeft }

  return { last_payment, expired_at, till_expired }
}