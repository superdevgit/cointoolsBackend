const mongoose = require('mongoose')

const BullTokenSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  totalSupply: {
    type: String,
    required: true,
  },
  marketCap: {
    type: Number,
    required: true,
  },
  deltaPercent: {
    type: Number,
    required: true,
  }
})

module.exports = mongoose.model('BullToken', BullTokenSchema);