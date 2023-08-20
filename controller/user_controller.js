const User = require("../model/user_model");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const productdb = require('../model/product_model')
const addressDb = require('../model/address_model')
const orderDB = require('../model/orderModel')
const bannerDb = require('../model/banner_model')
require('dotenv').config();

let otp;
let userEmail;
let username;


// 404error
const error = async (req, res) => {
    try {
        res.render('404')

    } catch (error) {
        res.redirect("/error");
        console.log(error.message)
    }
}

// for send email
const sendVerifyMail = async (name, email, otp) => {

    try {
        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.email,
                pass: process.env.pass
            },
        });
        const emailOption = {
            from: process.env.email,
            to: email,
            subject: "For OTP verification",
            html: '<p>Hai ' +
                name +
                ", please enter your otp " + otp + "for your verification </p>",
        };
        transport.sendMail(emailOption, (err, info) => {
            if (err) {
                console.log(err.message);
            } else {
                console.log(otp + "mail as bee sent to:", info.response);
            }
        })
    } catch (error) {
        res.redirect("/error");
        console.log(error.message);
    }
};
// password bcrypt
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (err) {
        console.log(error.message);
    }
};
// otp load
const otpLoad = async (req, res) => {
    try {
        res.render("otp")
    } catch (error) {
        res.redirect("/error");
        console.log(error.message);
    }
}
// otp validate
const otpVerify = async (req, res) => {
    try {
        const otpget = req.body.otp;

        if (otpget == otp) {

            const userData = await User.findOneAndUpdate(
                { email: userEmail },
                { $set: { is_verified: 1 } }

            );

            res.render("login", { userData, message: "success" })
        } else {
            res.redirect("/otp")
        }
    } catch (error) {
        res.redirect("/error");
        console.log(error.message);
    }
}

// loginPage
const loadlogin = async (req, res) => {
    try {
        res.render("login")
    } catch (err) {
        res.redirect("/error");
        console.log(error.message);
    }
};
const verifylogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email });
        if (userData == null) {
            res.render("login", { message: "user not exist" });
        } else if (userData.is_verified == 1) {
            if (userData.is_block == false) {
                if (userData.email) {
                    const passwordMatch = await bcrypt.compare(
                        password, userData.password
                    );
                    if (passwordMatch) {
                        req.session.userId = userData._id;
                        res.redirect("/home");
                    } else {
                        res.render("login", { userData, email, message: "username or password is incorrect" })
                    }
                } else {
                    res.render("login", { userData, email, message: "username or password is incorrect" })
                }
            } else {
                res.render("login", { message: "you are Blocked......" })
            }

        } else {
            res.render("login", { message: "You are not verified" })
        }

    } catch (err) {
        res.redirect("/error");
        console.log(err.message);
    }
};
// signUp
const signupload = async (req, res) => {
    try {
        res.render("signup")
    } catch (err) {
        res.redirect("/error");
        console.log(err.message);
    }
};
const signupverify = async (req, res) => {
    const existmail = await User.findOne({ email: req.body.email })
    if (existmail) {
        res.render('signup', { message: "user alreadyexist" })
    } else {
        try {


            const name = req.body.name
            const email = req.body.email
            userEmail = email
            userName = name


            const spassword = await securePassword(req.body.password)
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: spassword
            })




            const userData = await user.save()



            if (userData) {

                const generateOtp = Math.floor(1000 + Math.random() * 9999)
                otp = generateOtp;

                sendVerifyMail(req.body.name, req.body.email, otp);
                res.render('otp')
            } else {
                res.render('signup', { message: 'oops , something went wrong' })
            }


        } catch (error) {
            res.redirect("/error");
            console.log(error.message);
        }

    }
}
const logout = async (req, res) => {
    try {
        req.session.destroy()
        res.redirect('/login')
    } catch (error) {
        res.redirect("/error");
        console.log(error.message);
    }
}
// homeload
const homeload = async (req, res) => {
    try {
       
        const user = req.session.userId
        const product= await productdb.find({is_block:false}).sort({createdAt:-1}).limit(8)
        const banner=await bannerDb.findOne({unlist:false})
        res.render('home', { user,product,banner })

    } catch (error) {
        res.redirect("/error");
        console.log(error.message);
    }
}
const userprofileload = async (req, res) => {
    try {
        const user = req.session.userId

        const userdata = await User.findOne({ _id: user })
        const addressData = await addressDb.findOne({ user_id: user })
        const order = await orderDB.find({ user: user }).populate('products.productId')
        res.render('userprofile', { user, userdata, addressData, order })

    } catch (error) {
        res.redirect("/error");
        console.log(error.message)
    }
}
const editdetails = async (req, res) => {
    try {
        const id = req.query.id;
        const data = await User.findByIdAndUpdate(id, {
            $set: {
                name: req.body.name,
                phone: req.body.phone,

            }
        })
        res.redirect('/userprofile')
    } catch (error) {
        res.redirect("/error");
        console.log(error.message);
    }
}
const add_address = async (req, res) => {
    try {
        const user = req.session.userId

        res.render("add_address", { user })
    } catch (error) {
        res.redirect("/error");
        console.log(error.message)
    }
}
const updateAddress = async (req, res) => {
    try {

        const user = req.session.userId
        const userData = await User.findOne({ _id: req.session.userId })
        const addressData = await addressDb.findOne({ user_id: req.session.userId })
        if (addressData) {

            await addressDb.updateOne({ user_id: req.session.userId },
                {
                    $push: {
                        address: {
                            fname: req.body.fname,
                            lname: req.body.lname,
                            phone: req.body.phone,
                            email: req.body.email,
                            address: req.body.address,
                            pin: req.body.pin,
                        },
                    },
                });
            res.redirect('/userprofile');

        } else {
            const data = new addressDb({
                user_id: userData,
                address: [{
                    fname: req.body.fname,
                    phone: req.body.phone,
                    email: req.body.email,
                    address: req.body.address,
                    state: req.body.state,
                    pin: req.body.pin,
                }
                ]
            })
            const addressData = await data.save();
            if (addressData) {
                res.redirect('/userprofile')
            } else {
                res.render('/update_address')
            }

        }
    } catch (error) {
        res.redirect("/error");
        console.log(error.message);
    }
};
const editAddressload = async (req, res) => {
    try {

        const user = req.session.userId
        const addressId = req.query.id

        const addressdata = await addressDb.findOne({ user_id: user, 'address._id': addressId });


        res.render('editAddress', { user, addressdata })


    } catch (error) {
        res.redirect("/error");
        console.log(error.message)
    }
}
const editAddress = async (req, res) => {
    try {
        const { userId } = req.session
        const { fname, email, phone, address, state, pin } = req.body
      

        const data = await addressDb.updateOne({ user_id: userId }, {
            $set: {
                address: [{
                    fname: fname,
                    phone: phone,
                    email: email,
                    address: address,
                    state: state,
                    pin: pin,
                }
                ]
            },
        })
 
        res.redirect('/userprofile')
    } catch (error) {
        console.log(error.message)
    }
}
const changePassword = async (req, res) => {
    try {

        const user = req.query.id
        res.render('changePassword', { user })
    } catch (error) {
        res.redirect("/error");
        console.log(error.message);
    }
}
const passwordChange = async (req, res) => {
    try {
       
        const id = req.session.userId
        const userData = await User.findById({ _id: id })
        const password = req.body.CurrentPassword
        const passwordMatch = await bcrypt.compare(
            password, userData.password
        );
        if (passwordMatch) {
            const spassword = await securePassword(req.body.NewPassword)
            await User.findByIdAndUpdate({ _id: id }, { $set: { password: spassword } });
            res.json({success : true , message : 'password changed successfully'})
        } else {
            res.json({success : false , message : 'invalid old password'})   
        }


    } catch (error) {
        res.json({sucess : false})
        console.log(error.message);
    }
}
const orderDetails=async(req,res)=>{
    try{
   
        const user=req.session.userId
        const {id}=req.query
     

        const order = await orderDB.findById({_id:id}).populate('products.productId');
      
        res.render('order_details',{order,user})
    }catch(error){
        console.log(error.message)
    } 
}
const orderCancel=async(req,res)=>{
    try{
       
        const {userId}=req.session     
        // const {id,total}=req.query
        const id=req.body.orderId
        const total=req.body.total
        
        
        const status1="Cancelled"
        const order=await orderDB.findOne({_id:id}).populate('products.productId')
       
        await orderDB.updateOne({_id:id},{$set:{ status: status1 }})
        const products=order.products
        for(let product of products){
          
        await productdb.updateOne({_id:product.productId},{$inc:{stock:product.quantity}})
      }
      if(order.payment==="razorpay"){
        await User.findOneAndUpdate({_id:userId},{$inc:{wallet:total},
         $push:{
            walletHistory:{
                date:new Date(),
                amount:order.totalAmount,
                description:`refunded for order cancel-orderId ${id}`
            }
         }
        }
         )
         
    
      }
      res.json({success:true,status:status1})

    }catch(error){
        console.log(error)
    }
}
const returnOrder=async(req,res)=>{
    try{
        const id=req.body.orderId
        const status1="Return Pending"
       await orderDB.updateOne({_id:id},{$set:{status:status1}})
       res.json({success:true,status:status1})

    }catch(error){
        console.log(error.message)
    }
}
const loadWallet=async(req,res)=>{
    try{
        const user=req.session.userId
        const wallet=await User.findById({_id:user})
        console.log(wallet);
        
        res.render('wallet',{user,wallet})

    }catch(error){
        console.log(error.message)
    }
}
const orderList=async(req,res)=>{
    try{
        
        const user=req.session.userId
        const order=await orderDB.find({user:user}).populate('products.productId')
   
        res.render('orderList',{user,order})

    }catch(error){
        console.log(error.message)
    }
}
const forgotPassword=async (req,res)=>{
    try{
       
    res.render('forgetPassword')
    }catch{
        console.log(error.message)
    }
}
const forgotPasswordPost=async(req,res)=>{
    try{
        const email=req.body.email
     
        const user=await User.findOne({email:email})
        if(user){
        if(user.is_verified==1){
            if(user.is_block==false){
                const generateOtp = Math.floor(1000 + Math.random() * 9999)
                otp = generateOtp;

                sendVerifyMail(req.body.name, req.body.email, otp);
                req.session.email=email
                console.log(req.session.email,'jasdfj')
                res.render('forgotPasswordOtp',{email})

            }else{
                res.render('forgetPassword',{message:"User is blocked..."})
            }
        }else{
            res.render('forgetPassword',{message:'User is not verified'})
        }
    }else{
        res.render('forgetPassword',{message:'User is not found'})
    }
    }catch(error){
        console.log(error.message)
    }
}
const newPassword=async(req,res)=>{
    try{
      
        const {password,email}=req.body
       
        const passwordHash=await bcrypt.hash(password, 10);

        const user=await User.updateOne({
            email:email
        },{$set:{password:passwordHash}})
        res.redirect('/login')

    }catch(error){
        console.log(error.message)
    }
}
const forgotPasswordOtp=async(req,res)=>{
    try{
        const email=req.session.email
        console.log(email,'emailll')
        let {message} = req.session
        req.session.message=''
        res.render('forgotPasswordOtp',{message,email})

    }catch(error){
        console.log(error.message)
    }
}
const forgotOtpPost=async (req,res)=>{
    try{
       const email=req.session.email
    
        const user=await User.findOne({email:email})

        const otpget=req.body.otp
        if(otpget==otp){
            res.render('newPassword',{email})
        }else{
            req.session.message='OTP is incorrect'
            res.redirect('/forgotPasswordOtp')
        }
        

    }catch(error){
        console.log(error.message)
    }
}








module.exports = {
    error,
    loadlogin,
    verifylogin,
    signupload,
    signupverify,
    otpLoad,
    otpVerify,
    homeload,
    logout,
    userprofileload,
    editdetails,
    add_address,
    updateAddress,
    editAddressload,
    editAddress,
    changePassword,
    passwordChange,
    orderDetails,
    orderCancel,
    loadWallet,
    returnOrder,
    orderList,
    forgotPassword,
    forgotPasswordPost,
    newPassword,
    forgotPasswordOtp,
    forgotOtpPost,
   


}