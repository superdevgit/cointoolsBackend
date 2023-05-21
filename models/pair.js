const mongoose = require('mongoose')

const PairSchema = new mongoose.Schema({
  currency: mongoose.Types.ObjectId,
  swap: String,
  symbol: String,
  price: Number,
  volume: Number,
  volume24h: Number,
  link: String
})

module.exports = mongoose.model('Pair', PairSchema);