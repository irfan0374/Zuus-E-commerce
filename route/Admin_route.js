const express=require('express');
const rout=express();
const path=require('path');
const multer=require('multer');
const admincontroller=require("../controller/Admin-Controller");
const productcontroller=require('../controller/Product_Controller')
const couponController=require('../controller/Coupon_Controller')
const bannerController=require('../controller/Banner_Controller')
const adminAuth = require('../middleware/Admin_auth')
const image = require('../Config/Multer')


rout.set('view engine','ejs');
rout.set('views','./views/admin')


// admin login
rout.get('/' ,adminAuth.isLogout,admincontroller.adminlogin)
rout.post('/login' ,adminAuth.isLogout,admincontroller.adminverify)
rout.get('/logout',adminAuth.isLogin,admincontroller.logout) 

// admin dashboard

rout.get( '/dashboard',adminAuth.isLogin,admincontroller.adminDashboard)
rout.get( '/salesReport',adminAuth.isLogin,admincontroller.salesReportload)
// rout.post( '/salesReport',adminAuth.isLogin,admincontroller.salesReport)

// Banner
rout.get('/bannerLoad',bannerController.bannerLoad)
rout.get('/addBanner',bannerController.addBanner)
rout.post('/addBanner',adminAuth.isLogin,image.upload.array('image',5),bannerController.addBannerPost)
rout.get('/deleteBanner',bannerController.deleteBanner)
rout.get('/editBanner',bannerController.editBannerload)
rout.post('/editBanner',image.upload.array('image',5),bannerController.editBanner)




// userlist
rout.get('/userlist',adminAuth.isLogin,admincontroller.userlist)
rout.get('/userBlock/:id',admincontroller.userBlock)

// add caategory

rout.get('/category',adminAuth.isLogin,admincontroller.loadcategory)
rout.get('/addcategory',adminAuth.isLogin,admincontroller.addcategory)
rout.post('/addcategory',adminAuth.isLogin,admincontroller.insert_category)
rout.get('/catedit/:id',adminAuth.isLogin,admincontroller.catedit);
rout.post('/catedit',adminAuth.isLogin,admincontroller.catEditPost);
rout.get('/catblock/',adminAuth.isLogin,admincontroller.catblock)

//product list

rout.get('/product',adminAuth.isLogin,productcontroller.productlist)
rout.get('/addproduct',adminAuth.isLogin,productcontroller.add_product);
rout.post('/addproduct',adminAuth.isLogin,image.upload.array('image',5), productcontroller.insertproduct);
rout.get('/editproduct',productcontroller.editproduct)
rout.post('/editproduct',adminAuth.isLogin,image.upload.array('image',5),productcontroller.posteditproduct)
rout.get('/blockproduct/',adminAuth.isLogin,productcontroller.productBlock)

// Oderlist
rout.get('/orderlist',adminAuth.isLogin,admincontroller.orderlist)
rout.get('/order_details',adminAuth.isLogin,admincontroller.orderDetail)
rout.post('/order_details',adminAuth.isLogin,admincontroller.orderUpdate)

// coupon 
rout.get('/loadCoupon',adminAuth.isLogin,couponController.couponLoad)
rout.post('/loadCoupon',adminAuth.isLogin,couponController.addCoupon)
rout.get('/listcoupon',adminAuth.isLogin,couponController.listCoupon)
rout.get('/editcoupon',adminAuth.isLogin,couponController.editCoupon)
rout.post('/editcoupon',adminAuth.isLogin,couponController.postEditCoupon)
rout.get('/deletecoupon',adminAuth.isLogin,couponController.couponDelete)





module.exports = rout
