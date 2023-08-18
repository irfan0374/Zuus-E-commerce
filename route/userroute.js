
const express = require('express');
const userroute = express()

userroute.set("view engine", "ejs")
userroute.set("views", "./views/user");
// Controller
const userController = require("../controller/user_controller")
const productController = require("../controller/product_controller")
const cartController = require('../controller/cartcontroller')
const checkoutController = require('../controller/checkoutController')
const userAuth = require('../middleware/userAuth')
const couponController = require('../controller/couponController')
const wishlistController = require('../controller/wishlist_controller')

// 404error
userroute.get('/error', userController.error)

// login

userroute.get("/", userController.homeload)
userroute.get("/login", userAuth.isLogout, userController.loadlogin)
userroute.post("/login", userController.verifylogin)
userroute.get("/signup", userController.signupload)
userroute.post("/signup", userController.signupverify)
userroute.get("/otp", userController.otpLoad);
userroute.post("/otp", userController.otpVerify);
userroute.get('/home', userController.homeload);
userroute.get('/signin', userAuth.isLogout, userController.loadlogin);
userroute.get('/logout', userController.logout)

// product
userroute.get('/product', productController.productload)
userroute.get('/singleproduct',productController.productDetails)

// userprofile

userroute.get('/userprofile',userAuth.isLogin, userController.userprofileload)
userroute.post('/userprofile', userController.editdetails)
userroute.get('/add_address',userAuth.isLogin, userAuth.isLogin,userController.add_address)
userroute.post('/add_address',userAuth.isLogin, userController.updateAddress)
userroute.get('/editAddress', userController.editAddressload)
userroute.post('/editAddress',userAuth.isLogin, userController.editAddress)
userroute.get('/changePassword',userAuth.isLogin, userController.changePassword)
userroute.post('/changePassword',userAuth.isLogin, userController.passwordChange)
userroute.get('/orderDetails',userAuth.isLogin, userController.orderDetails)
userroute.post('/cancelOrder',userAuth.isLogin, userController.orderCancel)


// cart
userroute.get('/cartload',userAuth.isLogin, cartController.cartload)
userroute.post('/addToCart',userAuth.isLogin, cartController.add_tocart)
userroute.post('/incrementqnty',userAuth.isLogin, cartController.incrementqnty)
userroute.post('/deleteCart',userAuth.isLogin, cartController.deleteCart)

// checkout page

userroute.get('/checkoutload',userAuth.isLogin, cartController.checkoutload)
userroute.post('/checkoutload',userAuth.isLogin, checkoutController.postCheckoutload)
userroute.get('/order-placed',userAuth.isLogin, checkoutController.orderplaced)
userroute.get('/add_address1',userAuth.isLogin, checkoutController.checkoutaddress)
userroute.post('/add_address1',userAuth.isLogin, checkoutController.postcheckoutaddress)
userroute.post('/verifypayment',userAuth.isLogin, checkoutController.verifypayment)

// order
userroute.patch('/returnOrder',userAuth.isLogin,userController.returnOrder)
userroute.get('/orderList',userAuth.isLogin,userController.orderList)

// coupon
userroute.post('/applycoupon',userAuth.isLogin, couponController.applycoupon)

// wishlist
userroute.get('/wishlist',userAuth.isLogin, wishlistController.wishlistLoad)
userroute.post('/addWishlist',userAuth.isLogin, wishlistController.addWishlist)
userroute.post('/addcart',userAuth.isLogin, wishlistController.add_tocart)
userroute.post('/deleteWishlist',userAuth.isLogin, wishlistController.deleteWishlist)

// wallet
userroute.get('/loadWallet',userAuth.isLogin, userController.loadWallet)

// forgotPassword
userroute.get('/forgotPassword',userController.forgotPassword)
userroute.post('/forgotPassword',userController.forgotPasswordPost)
userroute.get('/forgotPasswordotp',userController.forgotPasswordOtp)
userroute.post('/forgotPasswordotp',userController.forgotOtpPost)
userroute.post('/newPassword',userController.newPassword)











   

module.exports = userroute     