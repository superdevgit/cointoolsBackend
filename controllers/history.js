const HistoryService = require('../services/history')

const getHistory = async (req, res, next) => {
  const { wallet } = req.query
  try {
    const result = await HitoryService.getHistory(wallet)
    if (!result) {
        res.status(200).json({ success: false, data: null, msg: "Account not exist" })
    } else {
        res.status(200).json({ success: true, data: result, msg: "Get reward list success" })
    }
  } catch (error) {
    res.status(200).json({ success: false, data: null, msg: error })
  }
}

const withdrawReward = async (req, res, next) => {
  const { wallet } = req.query
  try {
    await HistoryService.withdrawReward(wallet)
    res.json({success: true})
  } catch (error) {
    res.status(200).json({ success: false, data: null, msg: error })
  }
}

const addReward = async (req, res, next) => {
  const { owner, token, course, user, pairid } = req.body
  try {
    await HistoryService.addReward(owner, token, course, user, pairid);
    res.json({success: true})
  } catch (error) {
    res.status(200).json({ success: false, data: null, msg: error })
  }
}

const updateStatus = async (req, res, next) => {
  const { wallet } = req.query
  try {
    await HistoryService.updateStatus(wallet)
    res.json({success: true})
  } catch (error) {
    res.status(200).json({ success: false, data: null, msg: error })
  }
}

module.exports = {
  getHistory,
  withdrawReward,
  addReward,
  updateStatus
}