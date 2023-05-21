const dotenv = require('dotenv')
const AdminService = require('../services/admin')
const SettingsService = require('../services/setting')
const jwt = require('jsonwebtoken')

dotenv.config()

const checkAdmin = async (req, res, next) => {
  const { wallet } = req.query
  try {
    const len = await AdminService.checkAdmin(wallet)
    console.log("len", len)
    if(len > 0){
      const jwtData = jwt.sign({ wallet }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 31556926 })
      console.log("res", jwtData)
      res.status(200).json({ success: true, data: jwtData, msg: 'You are admin'})
    }
    else{
      res.status(200).json({ success: false, data: null, msg: 'You are not admin'})
    }
  } catch (error) {
    console.log("error", error)
    res.status(200).json({ success: false, data: null, msg: error })
  }
}

const addAdmin = async (req, res, next) => {
  const { wallet } = req.body
  const adminRes = await AdminService.addAdmin(wallet)
  res.json({result:adminRes})
}

const setRewardView = async (req, res, next) => {
  const { amount } = req.body
  try {
    await SettingsService.setRewardView(amount)
    res.status(200).json({ success: true, data: amount, msg: "Set reward per view success" })
  } catch (error) {
    res.status(200).json({ success: false, data: null, msg: error })
  }
}

const setRewardRef = async (req, res, next) => {
  const { amount } = req.body
  try {
    await SettingsService.setRewardPerRef(amount)
    res.status(200).json({ success: true, data: amount, msg: "Set reward per ref success" })
  } catch (error) {
    console.log('setting reward ref:',error)
    res.status(200).json({ success: false, data: null, msg: error })
  }
}

module.exports = {
  checkAdmin,
  addAdmin,
  setRewardView,
  setRewardRef
}