const mongoose = require('mongoose')

const CurrencySchema = new mongoose.Schema({
  address: Object,
  swaps: Array,
  name: String,
  image: String,
  symbol: String,
  decimals: Number,
  price: Object,
  currentPrice: Number,
  totalSupply: Object,
  marketCap: Number,
  maxSupply: Number,
  diff1h: Number,
  diff1d: Number,
  diff1w: Number,
  marketCapChangePercent: Number,
  priceChart: Object,
  volume24h: Object,
  volume24hVal: Number,
  volume: Object,
  timestamp: Number,
  trending: Number,
  socials: Object,
  searched: Number,
  paymentList: Boolean,
  allowed: Boolean
})

module.exports = mongoose.model('Currency', CurrencySchema);