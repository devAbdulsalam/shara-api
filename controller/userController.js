const User = require('../models/userModel')
const Wallet = require('../models/walletModel')
const Transaction = require('../models/transactionModel')
const jwt = require('jsonwebtoken')
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}
// email config

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        // user:process.env.EMAIL,
        // pass:process.env.PASSWORD
        user:"ammuftau74@getMaxListeners.com",
        pass: "Avenger74"
    }
}) 


// // login user
const loginUser = async (req, res) => {
    const {phone, password} = req.body
    try {
        // retrieve user and wallet and transaction history
        const user = await User.login(phone, password)
        const wallet = await Wallet.findOne({ userId: user._id});
        const transaction = await Transaction.findOne({ userId: user._id});
        // create a token
        const token = createToken(user._id)
    
        res.status(200).json({user : {user, wallet, transaction, token}, message : "Log in successfully"})
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

// // signinUser
const signinUser = async (req, res) => {
    const {name, phone,  password} = req.body
    try {
        const user = await User.signup(name, phone, password)
        // create new wallet and transaction history for user
         const wallet = await Wallet.create({ userId: user._id, balance : "0", phone });
         const transaction = await Transaction.create({ userId: user._id });
         // create a token
        const token = createToken(user._id)

        res.status(200).json({user : {user, token, wallet, transaction, }, message: "Account created successfully"})
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}


// update User
const updateProfile = async (req, res) => {
    const {name, phone, address, email} = req.body
    const {id} = req.user

     if(!mongoose.Types.ObjectId.isValid({id})){
         return res.status(404).json({ error: 'Not a valid user'})
        }
    try{
        let user = await User.findByIdAndUpdate({_id :id})
        if(user){
            user.name = name || req.body.name || user.name
            user.phone = phone || req.bodyphone || user.phone
            user.address = address ||req.body.address || user.address
            user.email = email || req.body.email || user.email
        }
         user = await user.save()
        res.status(200).json({user, message: 'user Profile updated successfully'})
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}



// user profile pic
// // user profile
// const updateImage =  async (req, res) => {
//   const {name, phone, email, address} = JSON.parse(req.body.user)
//   console.log(name, phone, email, address)
//   try {
//     const image = req.files.image
//       const fileName =  new Date().getTime().toString() + path.extname(image.name);
//       const savePath = path.join(__dirname, "public", "uploads", fileName);
//       await image.mv(savePath)
//       res.status(200).json({ message : "image upload Successfully"})
//     } catch (error) {
//         res.status(404).json({error: error.message})
//     }
// }

// // forget Password
const forgetPassword = async (req, res) => {
    const {email} = req.body
    try {
        const user = await User.fgtpswd(email)
        // create a token
        const token = createToken(user._id)
        const link = `http://localhost:3000/user/reset-password/${user._id}/${token}`;

        const mailoption = {
            from: 'ammuftau74@gmail.com', // sender address
            to: email, // receivers address
            subject: "Email for Password Reset", // Subject line
            text: `This Link is valid for 2 Minutes ${link}`, // plain text body
            html: "<b>Hello world?</b>", 
        } 
        
        transporter.sendMail(mailoption, (error, info) => {
            if(error){
                console.log(error, "error");
                res.status(401).json({error: error})
            }else{
                console.log(info.response, "success");
                res.status(201).json({token, message: "Email sent successfully"})
            }
        })
        
        // console.log("Password reset link sent")
        // res.status(200).json({link, token, message : "Password reset link sent"})
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

// // reset Password
const resetPassword = async (req, res) => {
    const {id, token} = req.params
    try {
        const user = await User.resetpswd(id)
        // // verify the token
        const verify =  jwt.verify(token, process.env.SECRET)
        if(!verify){
           res.status(401).json({error: "verification failed"})
        }
        const link = `http://localhost:3000/user/reset-password/`
        console.log(user, verify)
        res.status(200).json({user, verify, link, token, message : "Password Reset Successfully"})

    } catch (error) {
        res.status(404).json({error: error.message})
    }
}

// // change Password
const changePassword = async (req, res) => {
    const {id, token} = req.params
    const {password} = req.body
    try {
        const user = await User.signup(email, password)
        // // verify the token
        const verify =  jwt.verify(token, process.env.SECRET)
        if(!verify){
          return res.status(401).json({error: "verification failed"}) 
        }
        if(user){
            console.log(password, user.password, verify)
        }
        res.status(200).json({verify, token, message : "Password Reset Successfully"})
    } catch (error) {
        res.status(404).json({error: error.message})
    }
}





module.exports = {
    signinUser,
    loginUser,
    updateProfile,
    // updateImage,
    forgetPassword,
    resetPassword,
    changePassword,
}