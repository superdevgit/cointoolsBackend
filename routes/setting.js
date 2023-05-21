const express = require('express')

const router = express.Router()

const SettingCtrl = require('../controllers/setting')

router.get('/duration', SettingCtrl.getDuration)

router.put('/duration', SettingCtrl.setDuration)

module.exports = router
