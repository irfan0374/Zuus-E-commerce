const express=require('express');
const rout=express();
const path=require('path');
const multer=require('multer');
const admincontroller=require("../controller/admin_controller");
const productcontroller=require('../controller/product_controller')
const image = require('../cnofig/multer')


rout.set('view engine','ejs');
rout.set('views','./views/admin')


// admin login
rout.get('/',admincontroller.adminlogin)
rout.post('/login',admincontroller.adminverify)
rout.get( '/dashboard',admincontroller.adminDashboard)

// userlist
rout.get('/userlist',admincontroller.userlist)
rout.get('/userBlock/:id',admincontroller.userBlock)

// add caategory

rout.get('/category',admincontroller.loadcategory)
rout.get('/addcategory',admincontroller.addcategory)
rout.post('/addcategory',admincontroller.insert_category)
rout.get('/catedit/:id',admincontroller.catedit);
rout.post('/catedit',admincontroller.catEditPost);
rout.get('/catblock/',admincontroller.catblock)

//product list

rout.get('/product',productcontroller.productlist)
rout.get('/addproduct',productcontroller.add_product);
rout.post('/addproduct',image.upload.array('image',5), productcontroller.insertproduct);
rout.get('/editproduct',image.upload.array('image',5),productcontroller.editproduct)
rout.post('/editproduct',image.upload.array('image',5),productcontroller.posteditproduct)
rout.get('/blockproduct/',productcontroller.productBlock)



module.exports = rout
