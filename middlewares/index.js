const jwt = require('jsonwebtoken')
const { ethers } = require('ethers')
const dotenv = require('dotenv')
const { V_ORIGIN } = require("../config")
const { ACCESS_TOKEN } = require("../config")
dotenv.config()

const verifyToken = (req, res, next) => {
    if (!req.headers) {
        return res.sendStatus(403)
    }
    const token = req.headers['authorization']
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403)
        next()
    })
}

const verifyOrigin = async (req, res, next) => {
    if (!req.headers) {
        return res.sendStatus(403)
    }
    const token = req.headers['authorization']
    if (token == null) return res.sendStatus(401)
    try {
        if (V_ORIGIN.includes(req.headers.origin)) {
            if (ethers.utils.keccak256(ethers.utils.toUtf8Bytes(ACCESS_TOKEN)) === token) {
                next()
            } else {
                return res.sendStatus(403)
            }
        } else {
            return res.sendStatus(403)
        }
    } catch (error) {
        return res.sendStatus(500)
    }
}

module.exports = {
  verifyOrigin,
  verifyToken
}
