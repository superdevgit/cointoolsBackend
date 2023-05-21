const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors')
const mongoose = require('mongoose')
const axios = require('axios')
Promise = require('bluebird')

const routes = require('./index.route')
const { V_ORIGIN } = require("./config")

dotenv.config()
const app = express()

let marketCap, dominance, gas, bitcoinPrice, exchanges = []

app.use(cors({ credentials: true, origin: V_ORIGIN }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/info/market', (req, res, next) => res.json({ marketCap, dominance, gas, bitcoinPrice, exchanges }))
app.use('/api', routes)

mongoose.Promise = Promise

const mongoUri = process.env.MONGO_HOST
mongoose.connect(mongoUri);
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`)
})

const port = process.env.PORT || 80

app.listen(port, () => {
  console.info(`server started on port ${port}`); // eslint-disable-line no-console
});

setInterval(async () => {
  try {
    const globalRes = (await axios.get('https://api.coingecko.com/api/v3/global')).data.data
    marketCap = Number(Math.floor(globalRes.total_market_cap.usd))
  } catch (err) { }
  try {
    const domRes = (await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false',)).data
    let sum = 0
    domRes.map((coin) => sum += coin.market_cap)
    dominance = `${domRes[0].symbol.toUpperCase()} - ${Number(domRes[0].market_cap * 100 / sum).toFixed(1)}% | ${domRes[1].symbol.toUpperCase()} - ${Number(domRes[1].market_cap * 100 / sum).toFixed(1)}%`
  } catch (err) { }
  try {
    const gasRes = (await axios.get('https://ethgasstation.info/api/ethgasAPI.json')).data
    gas = gasRes.average / 10
  } catch (err) { }
  try {
    btcPrice = (await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')).data.bitcoin.usd
  } catch (err) { }
  try {
    let excRes = []
    let curRes = []
    let page = 1
    const { btcPrice } = (await api.currency.getMarketInfo()).data
    do {
      curRes = (await axios.get(`https://api.coingecko.com/api/v3/exchanges?page=${page}`)).data
      excRes = [...excRes, ...curRes]
      ++page
    } while (excRes.length === (page - 1) * 100)
    exchanges = excRes.map((exchange, index) => {
      return {
        ...exchange,
        index: index + 1,
        trade_volume_24h_usd: exchange.trade_volume_24h_btc * btcPrice,
        coins: 0,
        chart: [],
        changePercent: 0
      }
    })
  } catch (err) { }
}, 10000)