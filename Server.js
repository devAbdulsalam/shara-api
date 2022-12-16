require('dotenv').config()

const express = require('express');
const compression = require('compression')
const mongoose = require("mongoose");
const cors = require("cors")
const userRoutes = require('./routes/user')

mongoose.set('strictQuery', false);
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
        console.log('connect to database successfully and listening on port', process.env.PORT);
    })
})
.catch((err) => console.log(err));

// // users routes
app.use("/user", userRoutes)

// // users routes
app.use("/wallet", userRoutes)
