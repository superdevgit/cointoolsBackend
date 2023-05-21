const dotenv = require('dotenv')
const { swaps } = require('../constants')

dotenv.config()

const getSwaps = async () => {
  return swaps
}

module.exports = {
  getSwaps
}