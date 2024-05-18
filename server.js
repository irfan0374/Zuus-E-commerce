
require('dotenv').config()
const express = require('express')
const session = require("express-session")
const mongoose = require("mongoose");
const job=require('./Config/Cron')
const nocache = require("nocache");
// mongoose.connect("mongodb://127.0.0.1:27017/e-commerce");
mongoose.connect(process.env.MONGO_URL).then(() => console.log("Connected MongoDb")).catch((err) => console.log("error!! failed to connect database"))

const app = express();



const {cartcount}=require('./middleware/Cart_count')

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: "secretKey",
  resave: false,
  saveUninitialized: false,
}));

app.use(cartcount)

app.set('view engine', 'ejs');
app.use(express.static('public'))


const userroute = require('./route/User_route')
app.use('/', userroute)

const adminroute = require('./route/Admin_route')
app.use('/admin', adminroute)

app.use(nocache());

app.use((req, res) => {
  try {
    res.redirect('/error')
  } catch (error) {
    console.log(error.message)
  }
})


app.listen(4000, () => {
  console.log('running sucessfull');
}) 

