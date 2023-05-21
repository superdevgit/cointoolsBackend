const mongoose = require('mongoose')

const BanlistSchema = new mongoose.Schema({
  chainId: Number,
  address: String,
  symbol: String
})

module.exports = mongoose.model('Banlist', BanlistSchema);