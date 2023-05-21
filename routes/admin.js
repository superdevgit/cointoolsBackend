const express = require('express')

const {verifyToken} = require('../middlewares')

const router = express.Router()

const AdminCtrl = require('../controllers/admin')

router.get('/check', AdminCtrl.checkAdmin)

router.put('/view', verifyToken, AdminCtrl.setRewardView)

router.put('/ref', verifyToken, AdminCtrl.setRewardRef)

router.post('/', AdminCtrl.addAdmin)

module.exports = router
