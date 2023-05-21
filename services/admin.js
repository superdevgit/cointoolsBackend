const Admin = require('../models/admin')

const checkAdmin = async wallet => {
  console.log("checkAdmin service", wallet)
  let admins = await Admin.find({ wallet })
  return admins.length
}

const addAdmin = async wallet => {
  let admin = new Admin({wallet})
  const adminRes = await admin.save()
  return adminRes
}

module.exports = {
  addAdmin,
  checkAdmin
}