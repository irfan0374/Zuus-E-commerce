
const express=require('express');
const userroute=express()

userroute.set("view engine","ejs")
userroute.set("views","./views/user");
// Controller
const userController=require("../controller/user_controller")
const productController=require("../controller/product_controller")
const userAuth = require('../middleware/userAuth')

// login

userroute.get("/" , userController.homeload)
userroute.get("/login" ,userAuth.isLogout, userController.loadlogin)
userroute.post("/login" , userController.verifylogin)
userroute.get("/signup" , userController.signupload)
userroute.post("/signup" , userController.signupverify)
userroute.get("/otp" , userController.otpLoad);
userroute.post("/otp" , userController.otpVerify);
userroute.get('/home',userController.homeload);
userroute.get('/signin',userAuth.isLogout,userController.loadlogin);
userroute.get('/logout',userController.logout)

// product
userroute.get('/product',productController.productload)
userroute.get('/singleproduct',productController.productDetails)

// userprofile

userroute.get('/userprofile',userController.userprofileload)
userroute.post('/userprofile',userController.editdetails)




module.exports = userroute     