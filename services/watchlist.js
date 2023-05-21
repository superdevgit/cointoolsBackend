const mongoose = require('mongoose')
const Watchlist = require('../models/watchlist')

const getWatchlist = async wallet => {
  const watchlist = await Watchlist.findOne({ wallet })
  if (!watchlist) {
    return []
  } else {
    return watchlist.coins
  }
}

const addWatchlist = async (wallet, id) => {
  let watchlist = await Watchlist.findOne({ wallet })
  if (!watchlist) {
    watchlist = new Watchlist({wallet:wallet, coins: [new mongoose.Types.ObjectId(id)]})
  } else {
    watchlist.coins = [...watchlist.coins, [id]]
  }
  await watchlist.save()
  return watchlist
}

const deleteWatchlist = async (wallet, id) => {
  let watchlist = await Watchlist.findOne({ wallet })
  watchlist.coins = watchlist.coins.filter(coin => coin !== id)
  await watchlist.save()
  return watchlist
}

module.exports = {
  getWatchlist,
  addWatchlist,
  deleteWatchlist
}