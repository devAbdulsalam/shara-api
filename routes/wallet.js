const express = require('express');
const router = express.Router()
// const requireAuth = require('../middleware/requireAuth')
const {wallet, createPin,  sendMoney, receiveMoney, sendOtp, verifyOtp, changePin,} = require('../controller/walletController')

// // get wallet
router.post('/', wallet)

// // create transaction pin
router.post('/create-pin', createPin)

// // get wallet
router.post('/send', sendMoney)

// // get wallet
router.post('/receive', receiveMoney)

// // verify OTP token
router.post('/send-otp', sendOtp)

// // verify OTP token
router.post('/verify-otp', verifyOtp)

// // change transaction pin
router.post('/change-pin', changePin)

module.exports = router