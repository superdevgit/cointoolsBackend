const HDWalletProvider = require('truffle-hdwallet-provider')
const { ethers } = require("ethers")
const dotenv = require('dotenv')
const abis = require("../constants/abis/rewardv1.json")
const Setting = require('../models/setting')

dotenv.config()

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.RPC_URL
)

const ethersProvider = new ethers.providers.Web3Provider(provider)

const setRewardView = async amount => {
  const contract = new ethers.Contract(process.env.REWARD_V1, abis, ethersProvider.getSigner())
  const tx = await contract.setRewardPerView(ethers.utils.parseEther(amount.toString()))
  await tx.wait()
}

const setRewardPerRef = async amount => {
  const contract = new ethers.Contract(process.env.REWARD_V1, abis, ethersProvider.getSigner())
  const tx = await contract.setRewardPerRef(ethers.utils.parseEther(amount.toString()))
  await tx.wait()
}

const getDuration = async () => {
  const settings = await Setting.find()
  if (settings.length > 0) {
    return settings[0].duration
  } else {
    return null
  }
}

const setDuration = async amount => {
  const settings = await Setting.find()
  if (settings.length > 0) {
    await Setting.findByIdAndUpdate(settings[0]._id, { duration: amount })
  } else {
    const setting = new Setting({ duration: amount })
    await setting.save()
  }
}

module.exports = {
  setRewardView,
  setRewardPerRef,
  getDuration,
  setDuration
}