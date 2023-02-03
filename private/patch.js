import fs from 'fs'

const walletConfigPath = './node_modules/tonweb/src/contract/wallet/index.js'

fs.readFile(walletConfigPath, 'utf8', function (err, data) {
  if (!data) return
  const result = data?.replace(`this.defaultVersion = 'v3R1'`, `this.defaultVersion = 'v4R2'`)
  fs.writeFile(walletConfigPath, result, 'utf8', (err) => err && console.log(err))
})