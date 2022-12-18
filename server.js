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
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
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


////use static for csss and other files
app.use(express.static('public'))

app.get("/", (req, res) => {
  res.sendFile('./views/index.html', {root : __dirname});
});

// // users routes
app.use("/user", userRoutes)

// // users routes
app.use("/wallet", userRoutes)


// 404 page
app.use( (req, res) =>{
    res.status(404).sendFile('./views/404.html', {root : __dirname});
})