const mongoose=require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/e-commerce");


const express = require( 'express')
const session=require("express-session")
const dotenv=require('dotenv').config()

const app=express();
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
app.use( express.json())
app.use( express.urlencoded({extended : false}))
app.use(session({
    secret: "secret", 
    resave: false,              
    saveUninitialized: false,   
  }));


app.set('view engine','ejs');
app.use(express.static('public'))


const userroute=require('./route/userroute')
app.use('/',userroute)

const adminroute=require('./route/adminroute')
app.use('/admin',adminroute)


app.listen(4000 , () => {
    console.log('running sucessfull');
}) 