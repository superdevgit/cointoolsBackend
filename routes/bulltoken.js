const express = require('express')

const router = express.Router()

const CurrencyCtrl = require('../controllers/currency')

router.get('/', CurrencyCtrl.getBullishTokens)

module.exports = router
