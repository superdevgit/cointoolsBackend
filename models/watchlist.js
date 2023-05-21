const mongoose = require('mongoose')

const WatchlistSchema = new mongoose.Schema({
  wallet: {
    type: String,
    required: true,
  },
  coins: {
    type: [mongoose.Types.ObjectId]
  }
})

module.exports = mongoose.model('Watchlist', WatchlistSchema);