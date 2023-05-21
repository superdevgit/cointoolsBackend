const Promise = require('bluebird')
const { ethers } = require("ethers")
const HDWalletProvider = require('truffle-hdwallet-provider')
const dotenv = require('dotenv')
const History = require('../models/history')

dotenv.config()
const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.RPC_URL
)

const ethersProvider = new ethers.providers.Web3Provider(provider)

const getHistory = async wallet => {
  const histories = await History.find({ owner: wallet })
  return histories
}

const withdrawReward = async wallet => {
  const contract = new ethers.Contract(process.env.REWARD_V1, abis, ethersProvider.getSigner())
  const null_address = "0x0000000000000000000000000000000000000000"
  const histories = await History.find({ isAdded: 0 })
  if (!histories) {
    res.status(404).json({ success: false, data: null, msg: err })
  } else if (histories.length > 0) {
    const courseType = { Home: 0, Charts: 1, Pairs: 2, Account: 3, Promote: 4 }
    let courses = [], pairs = [], owners = [], users = []
    histories.map(history => {
      courses.push(courseType[history.course])
      pairs.push(history.pairid || null_address)
      owners.push(history.owner)
      users.push(history.user || null_address)
    })
    const tx = await contract.addReward(courses, pairs, owners, users)
    await tx.wait()
    await Promise.all(histories.map(async history => {
      await History.findByIdAndUpdate(history._id, { isAdded: 1 })
    }))
    res.status(200).json({ success: true, data: null, msg: "Add rewards success" })
  } else {
    res.status(200).json({ success: true, data: null, msg: "All datas are up to date" })
  }
}

const addReward = async (owner, token, course, user, pairid) => {
  const time = new Date().getTime()
  const contract = new ethers.Contract(process.env.REWARD_V1, abis, ethersProvider.getSigner())
  const rewardPerRef = ethers.utils.formatEther(await contract.rewardPerRef())
  const rewardPerView = ethers.utils.formatEther(await contract.rewardPerView())
  let histories
  if (course === 'Promote') {
    histories = await History.find({ owner: owner, user: user, pairid: pairid })
    if (result?.length > 0) {
      res.status(404).json({ success: false, data: null, msg: "Already exist" })
    } else {
      const history = new History({ owner: owner, token: token, amount: parseInt(rewardPerRef, 10), course: course, pairid: pairid, time: parseInt(time / 1000, 10), status: 0, user: user, isAdded: 0 })
      const result = await history.save()
      if (!result) {
        res.status(404).json({ success: false, data: null, msg: err })
      } else {
        res.status(200).json({ success: true, data: result, msg: "Add reward success" })
      }
    }
  } else {
    histories = await History.find({ owner: owner, course: course })
    if (histories.length > 0) {
      res.status(200).json({ success: false, data: null, msg: "Already exist" })
    } else {
      const history = new History({ owner: owner, token: token, amount: parseInt(rewardPerView, 10), course: course, pairid: pairid, time: parseInt(time / 1000, 10), status: 0, user: user, isAdded: 0 })
      const result = await history.save()
      if (!result) {
        res.status(404).json({ success: false, data: null, msg: err })
      } else {
        res.json({ success: true, data: result, msg: "Add reward success" })
      }
    }
  }
}

const updateStatus = async (wallet) => {
  const histories = await History.find({ owner: wallet, status: 0 })
  if (!histories) {
    return res.status(404).json({ success: false, data: null, msg: "Nothing to update" })
  }
  await Promise.all(histories.map(async history => {
    await History.findByIdAndUpdate(history._id, { status: 1 })
  }))
  res.json({ success: true, msg: "Update completed" })
}

module.exports = {
  getHistory,
  withdrawReward,
  addReward,
  updateStatus
}