const express = require('express')

const router = express.Router()

const WatchlistCtrl = require('../controllers/watchlist')

router.get('/:wallet', WatchlistCtrl.getWatchlist)

router.post('/:wallet', WatchlistCtrl.addWatchlist)

router.delete('/:wallet/:id', WatchlistCtrl.deleteWatchlist)

module.exports = router
