const User = require("../modle/user_model");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const productdb=require('../modle/product_model')
require('dotenv').config();

let otp;
let userEmail;
let username;




// for send email
const sendVerifyMail=async(name,email,otp)=>{

try{
const transport=nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    requireTLS:true,
    auth:{
        user:process.env.email,
        pass:process.env.pass
    },
});
const emailOption={
    from:process.env.email,
    to:email,
    subject:"For OTP verification",
    html:'<p>Hai '+
    name+
    ", please enter your otp "+otp+"for your verification </p>",
};
transport.sendMail(emailOption,(err,info)=>{
    if(err){
        console.log(err.message);
    }else{
        console.log(otp + "mail as bee sent to:",info.response);
    }
})
}catch(error){
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

            res.render("login", { userData,message: "success" })
        } else {
            res.redirect("/otp")
        }
    } catch (error) {
        console.log(error.message);
    }
}

// loginPage
const loadlogin = async (req, res) => {
    try {
        res.render("login")
    } catch (err) {
        console.log(error.message);
    }
};
const verifylogin = async (req,res) => {
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
        console.log(err.message);
    }
};
// signUp
const signupload = async (req, res) => {
    try {
        res.render("signup")
    } catch (err) {
        console.log(err.message);
    }
};
const signupverify = async (req, res) => {
    const existmail = await User.findOne({ email: req.body.email })
    if (existmail) {
        res.render('signup',{message:"user alreadyexist"})
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
            phone:req.body.phone,
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
        console.log(error.message);
    }
 
}
}
const logout = async (req,res) =>{
    try {
        req.session.destroy()
        res.redirect('/login')
    } catch (error) {
        console.log(error.message);
    }
}
// homeload
const homeload=async(req,res)=>{
    try{
        const user = req.session.userId
        res.render('home',{user})
    }catch(error){
        console.log(error.message);
    }
}
const userprofileload=async(req,res)=>{
    try {
        const user = req.session.userId
        const userdata= await User.findOne({_id:user})
        const userid=req.query.id
        res.render('userprofile',{user,userid,userdata})
        
    } catch (error) {
        console.log(error.message)
    }
}
const editdetails=async(req,res)=>{
        try{
            const id =req.query.id;
            const data=await User.findByIdAndUpdate(id,{
                $set:{
                    name:req.body.name,
                    phone:req.body.phone,

                }
            })
            res.redirect('/userprofile')
        }catch(error){
            console.log(error.message);
        }
}







module.exports = {
    loadlogin,
    verifylogin,
    signupload,
    signupverify,
    otpLoad,
    otpVerify,
    homeload,
    logout,
    userprofileload,
    editdetails

}