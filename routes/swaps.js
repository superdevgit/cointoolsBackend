const express = require('express')

const router = express.Router()

const SwapCtrl = require('../controllers/swaps')

router.get('/', SwapCtrl.getSwaps)

module.exports = router
