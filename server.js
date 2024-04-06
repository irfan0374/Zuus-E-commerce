
const express = require( 'express')
const session=require("express-session")
require('dotenv').config()
const mongoose=require("mongoose");
// mongoose.connect("mongodb://127.0.0.1:27017/e-commerce");
mongoose.connect(process.env.MONGO_URL).then((data) => console.log("Connected MongoDb")).catch((err) => console.log(err))



const app=express();

const cartCount=require('./middleware/cartcount')
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
app.use( express.json())
app.use( express.urlencoded({extended : false}))
app.use(session({
    secret: process.env.secret, 
    resave: false,              
    saveUninitialized: false,   
  }));
app.use(cartCount.cartcount)

app.set('view engine','ejs');
app.use(express.static('public'))


const userroute=require('./route/userroute')
app.use('/',userroute)

const adminroute=require('./route/adminroute')
app.use('/admin',adminroute)

app.use((req,res)=>{
  try{
    res.redirect('/error')
  }catch(error){
    console.log(error.message)
  }
})


app.listen(4000 , () => {
    console.log('running sucessfull');
}) 
