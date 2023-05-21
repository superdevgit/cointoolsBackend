const express = require('express')

const {verifyOrigin} = require('../middlewares')

const router = express.Router()

const HistoryCtrl = require('../controllers/history')

router.get('/', HistoryCtrl.getHistory)

router.post('/withdraw', verifyOrigin, HistoryCtrl.withdrawReward)

router.post('/', verifyOrigin, HistoryCtrl.addReward)

router.put('/', verifyOrigin, HistoryCtrl.updateStatus)

module.exports = router
