const mongoose = require('mongoose')

const SettingSchema = new mongoose.Schema({
  duration: {
    type: Number,
    required: true,
  }
})

module.exports = mongoose.model('Setting', SettingSchema);