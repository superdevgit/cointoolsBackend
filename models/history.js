const mongoose = require('mongoose')

const HistorySchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  amount: Number,
  course: {
    type: String,
    required: true,
  },
  pairid: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  isAdded: Number
})

module.exports = mongoose.model('History', HistorySchema);