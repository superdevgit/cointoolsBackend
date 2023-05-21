const SettingsService = require('../services/setting')

const getDuration = async (req, res, next) => {
  try {
    const duration = await SettingsService.getDuration()
    if (duration) {
      res.status(200).json({ success: true, data: duration, msg: "Get duration success" })
    } else {
      res.status(200).json({ success: false, data: null })
    }
  } catch (error) {
    console.log('error')
    res.status(404).json({ success: false, data: null, msg: error })
  }
}

const setDuration = async (req, res, next) => {
  const { amount } = req.body
  try {
    await SettingsService.setDuration(amount)
    res.status(200).json({ success: true, data: amount, msg: "Set duration success" })
  } catch (error) {
    res.status(404).json({ success: false, data: null, msg: error })
  }
}

module.exports = {
  getDuration,
  setDuration
}