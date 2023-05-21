const WatchlistService = require('../services/watchlist')

const getWatchlist = async (req, res, next) => {
  const { wallet } = req.params
  const watchlist = await WatchlistService.getWatchlist(wallet)
  res.json({success:true, data: watchlist})
}

const addWatchlist = async (req, res, next) => {
  const { wallet } = req.params
  const {id} = req.body
  const watchlist = await WatchlistService.addWatchlist(wallet, id)
  res.json({success:true, data: watchlist})
}

const deleteWatchlist = async (req, res, next) => {
  const { wallet, id } = req.params
  const watchlist = await WatchlistService.deleteWatchlist(wallet, id)
  res.json({success:true, data: watchlist})
}

module.exports = {
  getWatchlist,
  addWatchlist,
  deleteWatchlist
}