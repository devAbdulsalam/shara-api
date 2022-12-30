// const User = require('../models/userModel')
const Wallet = require('../models/walletModel')
const Transaction = require('../models/transactionModel')
const jwt = require('jsonwebtoken')
const speakeasy = require('speakeasy');
const bcrypt = require("bcryptjs");
const accountSid = process.env.ACCOUNT_SID
const auth_token = process.env.AUTH_TOKEN
const twilio = require("twilio")(accountSid, auth_token);

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}
// Generate an OTP secret
const secret = speakeasy.generateSecret({ length: 20 });
// console.log(secret.base32);  // Outputs the OTP secret in base32 format
// process.env.SECRET,

// // // // // // User Wallet
const wallet = async (req, res) => {
    const {id : userId, token} = req.body
    try {
        let wallet = await Wallet.findOne({userId})
        if (!wallet) {
            throw Error('wallet does not  exist!!')
        }
        // // verify the token
        const verify = jwt.verify(token, process.env.SECRET)
        if(!verify){
           throw Error("verification failed");
        }
        if(verify){
            res.status(200).json({wallet, message: "wallet found successfully"})
        }
    } catch (error) {
            res.status(404).json({error: error.message})
        }
}

// // // // // // create transaction pin
const createPin = async (req, res) => {
    const {id : userId, pin, token} = req.body
    try {
        let wallet = await Wallet.findOne({userId})

        if (!wallet) {
            throw Error('wallet does not  exist!!')
        }
        // // verify the token
        const verify =  jwt.verify(token, process.env.SECRET)

        if(!verify){
           throw Error("verification failed")
        }
        
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(pin, salt)
        if(wallet){
            wallet.pin = hash
        };
        wallet = await wallet.save()

        res.status(200).json({wallet, pin, message: "transaction pin created successfully"})
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}
// // // // // // send funds to user
const sendMoney = async (req, res) => {
    const {phone, amount, pin, id, token} = req.body
    try {
        let wallet = await Wallet.findOne({_id :id})
        let receiver = await Wallet.findOne({phone})
        let send = await Transaction.findOne({_id :id})
        
        if (!wallet) {
            throw Error('wallet does not  exist!!')
        }
        if (!receiver) {
            throw Error('wallet does not  exist!!')
        }
        // // verify the token
        const verify =  jwt.verify(token, process.env.SECRET)

        if(!verify){
           throw Error("verification failed")
        }
        const match =  bcrypt.compare(pin, wallet.pin)
        if (!match) {
            throw Error('Incorrect password')
        }
        if(wallet){
            wallet.balance = wallet.balance + amount
        };
        wallet = await wallet.save()
        res.status(200).json({pin, amount, send, wallet, message: "found sent successfully"})
        
    } catch (error) {
            res.status(404).json({error: error})
        }
}

// // // // // // recieve funds to user
const  receiveMoney = async (req, res) => {
    const {amount, phone} = req.body
    try {
        let wallet = await Wallet.findOne({phone})

        if (!wallet) {
            throw Error('wallet does not  exist!!')
        }
        if(wallet){
            wallet.balance = wallet.balance + amount
        };
        res.status(200).json({wallet, amount, message: "fund sent successfully"})
    } catch (error) {
            res.status(404).json({error: error})
        }
}
    
// // // // // // send OTP token
const sendOtp = async (req, res) => {
    const {id, token} = req.body
    try {
        let user = await user.findOne({_id :id})

        if (!user) {
            throw Error('user does not  exist!!')
        }
        // // verify the token
        const verify =  jwt.verify(token, process.env.SECRET)

        if(!verify){
           throw Error("verification failed")
        }

        // // Create the OTP token
        const OTP = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32'
        });

        // // send the OTP token to the user
        twilio.messages.create({
            from:"+17655133822",
            to: user.phone,
            body:`This your ${OTP} token, valid for 5 minutes`,
        }).then((res) => {
            res.status(200).json({OTP, message: "Password reset link sent successfully"})
        })
        .catch((error) => {
            console.log(error, "error");
            res.status(401).json({error: error})
        })
    } catch (error) {
        res.status(404).json({error: error})
    }
}

// // // // // // Verify OTP token
const verifyOtp = async (req, res) => {
    const {id, token, otp} = req.body
    try {
        let user = await user.findOne({_id :id})

        if (!user) {
            throw Error('user does not  exist!!')
        }
        // // verify the token
        const verify =  jwt.verify(token, process.env.SECRET)

        if(!verify){
           throw Error("verification failed")
        }

        // Verify an OTP token
        const verified = speakeasy.totp.verify({
           secret: secret.base32,
           encoding: 'base32',
           token: otp,
           window: 2  // Allow for a 2-step window of time for the token to be verified
        }); 

        if(!verified){
           throw Error("OTP verification failed")
        }

        if(verified){
            res.status(200).json({verified, message: "Verification successfully"})
        }

    } catch (error) {
        res.status(404).json({error: error})
    }
}

// // // // // // Change Pin
const changePin = async (req, res) => {
    const {id, token} = req.body
    try {
        let user = await user.findOne({_id :id})

        if (!user) {
            throw Error('user does not  exist!!')
        }
        // // verify the token
        const verify =  jwt.verify(token, process.env.SECRET)

        if(!verify){
           throw Error("verification failed")
        }

        // Verify an OTP token
        const verified = speakeasy.totp.verify({
           secret: secret.base32,
           encoding: 'base32',
           token: 'ENTER TOKEN HERE',
           window: 2  // Allow for a 2-step window of time for the token to be verified
        }); 

        if(!verified){
           throw Error("OTP verification failed")
        }

        if(verified){
            res.status(200).json({verified, message: "Verification successfully"})
        }

    } catch (error) {
        res.status(404).json({error: error})
    }
}



module.exports = {
    wallet,
    createPin,
    sendMoney,
    receiveMoney,
    sendOtp,
    verifyOtp,
    changePin,
}