const SwapsService = require('../services/swaps')

const getSwaps = async (req, res, next) => {
  try {
    const swaps = await SwapsService.getSwaps()
    res.status(200).json({ success: true, data: swaps, length: swaps.length, msg: "Get swap list success" })
  } catch (error) {
    res.status(502).json({ success: false, data: null, msg: error })
  }
}

module.exports = {
  getSwaps
}