const express = require('express')

const router = express.Router()

const CurrencyCtrl = require('../controllers/currency')

router.get('/history', CurrencyCtrl.getCurrencyHistory)

router.get('/price', CurrencyCtrl.getCurrencyPrices)

router.get('/topmarketcap', CurrencyCtrl.getTopMarketCap)

router.get('/topdailyprice', CurrencyCtrl.getTopDailyPriceGrowth)

router.get('/topdailyvolume', CurrencyCtrl.getTopDailyVolumeGrowth)

router.get('/gainers', CurrencyCtrl.getGainers)

router.get('/losers', CurrencyCtrl.getLosers)

router.get('/recentlyadded', CurrencyCtrl.getRecentlyAdded)

router.get('/trending', CurrencyCtrl.getTrending)

router.get('/all', CurrencyCtrl.getAllCurrencies)

router.get('/mostSearched', CurrencyCtrl.getMostSearched)

router.post('/ban', CurrencyCtrl.banCurrencies)

router.post('/updateAllowed', CurrencyCtrl.updateAllowed)

router.post('/updateAllAllowed', CurrencyCtrl.updateAllAllowed)

router.put('/:id/socials', CurrencyCtrl.updateSocials)

router.get('/:id', CurrencyCtrl.getCurrency)

router.get('/', CurrencyCtrl.getCurrencies)

router.post('/', CurrencyCtrl.addCurrencies)

module.exports = router
