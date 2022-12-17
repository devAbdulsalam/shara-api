require('dotenv').config()

const express = require('express');
const compression = require('compression')
const mongoose = require("mongoose");
const cors = require("cors")
const userRoutes = require('./routes/user')

mongoose.set('strictQuery', true);
// express app
const app = express();
//compression
app.use(compression());
// cors settings
app.use(cors({
    origin: "https://localhost:3000",
}));
app.use(express.json());

// //connect database
mongoose.connect(process.env.MDB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology : true
})
.then(()=> {
    app.listen(process.env.PORT, () => {
        console.log('connected to database successfully and listening on port', process.env.PORT);
        console.log("Welcome to shara-api")
    })
})
.catch((err) => console.log(err));


app.use('/', express.static('public'))
// app.use('/', render())

// // users routes
app.use("/user", userRoutes)

// // users routes
app.use("/wallet", userRoutes)
