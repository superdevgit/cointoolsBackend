const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
  wallet: {
    type: String,
    required: true,
  }
})

AdminSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    wallet: this.wallet
  }
};

module.exports = mongoose.model('Admin', AdminSchema);