const express = require('express')

const router = express.Router()
const adminRoutes = require('./routes/admin')
const settingRoutes = require('./routes/setting')
const watchlistRoutes = require('./routes/watchlist')
const historyRoutes = require('./routes/history')
const currencyRoutes = require('./routes/currency')
const hotTokenRoutes = require('./routes/hottoken')
const bullTokenRoutes = require('./routes/bulltoken')
const swapRoutes = require('./routes/swaps')

router.get('/health-check', (req, res) =>
  res.send('OK')
)

router.use('/admin', adminRoutes)

router.use('/setting', settingRoutes)

router.use('/watchlists', watchlistRoutes)

router.use('/history', historyRoutes)

router.use('/currency', currencyRoutes)

router.use('/hottokens', hotTokenRoutes)

router.use('/bulltokens', bullTokenRoutes)

router.use('/swaps', swapRoutes)

module.exports = router