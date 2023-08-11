const express=require('express');
const rout=express();
const path=require('path');
const multer=require('multer');
const admincontroller=require("../controller/admin_controller");
const productcontroller=require('../controller/product_controller')
const couponController=require('../controller/couponController')
const adminAuth = require('../middleware/adminAuth')
const image = require('../cnofig/multer')


rout.set('view engine','ejs');
rout.set('views','./views/admin')


// admin login
rout.get('/',adminAuth.isLogout,admincontroller.adminlogin)
rout.post('/login',adminAuth.isLogout,admincontroller.adminverify)
rout.get( '/dashboard',adminAuth.isLogin,admincontroller.adminDashboard)

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
rout.get('/editproduct',adminAuth.isLogin,image.upload.array('image',5),productcontroller.editproduct)
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
