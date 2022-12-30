const User = require('../models/userModel')
const Wallet = require('../models/walletModel')
const Transaction = require('../models/transactionModel')
const jwt = require('jsonwebtoken')
const mongoose = require("mongoose");
const speakeasy = require('speakeasy');
const accountSid = process.env.ACCOUNT_SID
const auth_token = process.env.AUTH_TOKEN

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

const twilio = require("twilio")(accountSid, auth_token);
// twilio.messages.create({
//     from:"+17655133822",
//     to:"+2349035095173",
//     body:"testing twilio"
// }).then((res) => console.log('message sent sucessfully'))
// .catch((error) => console.log(error))



// // forget Password
const changePin = async (req, res) => {
    const {id, token} = req.params
    try {
        let wallet = await Wallet.find({_id :id})

        if (!wallet) {
            throw Error('wallet does not  exist!!')
        }
        // // verify the token
        const verify =  jwt.verify(token, process.env.SECRET)

        if(!verify){
           throw Error("verification failed")
        }
        const link = `http://localhost:3000/resetpassword/${user._id}/${token}`;

        const mailoption = {
            from: 'ammuftau74@gmail.com', // sender address
            to: email, // receivers address
            subject: "Email for Password Reset", // Subject line
            text: `This Link is valid for 2 Minutes ${link}`, // plain text body
            html: `<p>This Link is valid for 2 Minutes ${link}</p>`, 
        } 
        
        transporter.sendMail(mailoption, (error, info) => {
            if(error){
                // console.log(error, "error");
                res.status(401).json({error: error})
            }else{
                // console.log(info.response, "success");
                res.status(200).json({token, info, message: "Password reset link sent successfully"})
            }
        })
    } catch (error) {
        res.status(404).json({error: error})
    }
}

// Generate an OTP secret
const secret = speakeasy.generateSecret({ length: 20 });
console.log(secret.base32);  // Outputs the OTP secret in base32 format

// Generate an OTP token
const token = speakeasy.totp({
  secret: secret.base32,
  encoding: 'base32'
});
console.log(token);  // Outputs the OTP token

// Verify an OTP token
const verified = speakeasy.totp.verify({
  secret: secret.base32,
  encoding: 'base32',
  token: 'ENTER TOKEN HERE',
  window: 2  // Allow for a 2-step window of time for the token to be verified
});
console.log(verified); 





module.exports = {
    changePin
}