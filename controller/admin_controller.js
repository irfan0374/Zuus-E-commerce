const admin = require("../model/admin_model");
const productdb = require("../model/product_model");
const User = require('../model/user_model');
const catdb = require('../model/category_model')
const orderdb = require('../model/orderModel')
const bcrypt = require('bcrypt');

// adminlogin
const adminlogin = async (req, res) => {
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }

}

const adminverify = async (req, res) => {
    try {

        const email = req.body.email
        const password = req.body.password
        const Userdata = await User.findOne({ email: email })
        if (Userdata) {
            const mpassword = await bcrypt.compare(password, Userdata.password);
            if (mpassword) {
                if (Userdata.is_admin === 1) {
                    req.session.adminId=email
                    res.redirect('/admin/dashboard')
                } else {
                    res.render('login', { message: "username or password is incorrect" })
                }
            } else {
                res.render('login', { message: 'username or password is incorrect' })
            }
        } else {
            res.render('login', { message: 'username or password is incorrect' })
        }
    } catch (error) {
        console.log(error.message);
    }
}

const adminDashboard = (req, res) => {
    try {
        res.render('home')
    } catch (error) {
        console.log(error.message)
    }
}
// userlist
const userlist = async (req, res) => {
    try {
        const userdata = await User.find({ is_admin: 0 })
        res.render('userlist', { users: userdata })
    } catch (error) {
        console.log(error.message)
    }
}
const userBlock = async (req, res) => {
    try {
        let id = req.params.id
        const userData = await User.findById({ _id: id });
        if (userData.is_block === false) {
            await User.updateOne({ _id: id }, { $set: { is_block: true } })
            res.redirect('/admin/userlist');
        } else {
            await User.updateOne({ _id: id }, { $set: { is_block: false } })
            res.redirect('/admin/userlist');
        }

    } catch (error) {
        console.log(error.message)
    }
}
const loadcategory = async (req, res) => {
    try {
        const category = await catdb.find()
        res.render('category', { catlist: category })
    } catch (error) {
        console.log(error.message);
    }
}
const addcategory = async (req, res) => {
    try {
        res.render('add_category')
    } catch (error) {
        console.log(error.message)
    }
}
const insert_category = async (req, res) => {
    try {
        const name = req.body.name;
        if (name.trim().length == 0) {
            res.redirect('/admin/addcategory')
        } else {
            const already = await catdb.findOne({
                name: { $regex: name, $options: "i" },
            })
            if (already) {
                res.render('add_category', { message: 'This category is already taken' })
            } else {
                const category = new catdb({ name: name })
                const catdata = await category.save()
                if (catdata) {
                    res.redirect('/admin/category')
                } else {
                    res.render('add_category', { message: 'something went wrong' })
                }
            }

        }
    } catch (error) {
        console.log(error.message)
    }
}
//category
const catedit = async (req, res) => {
    try {
        const id = req.params.id
        const editdata = await catdb.findById({ _id: id });

        res.render('catedit', { data: editdata })
    } catch (error) {
        console.log(error.message)
    }
}


const catEditPost = async (req, res) => {
    try {
        const name = req.body.name;
        const id = req.body.id;

        if (name.trim().length == 0) {
            res.redirect('/admin/catedit')
        } else {
            const already = await catdb.findOne({
                name: { $regex: name, $options: "i" },
            })
            if (already) {
                res.render('catedit', { message: 'This category is already taken' })
            } else {

                const data = await catdb.findByIdAndUpdate({ _id: id }, { $set: { name: name } })
                res.redirect('/admin/category')
            }
        }

    } catch (error) {
        console.log(error.message)
    }

}
const catblock = async (req, res) => {
    try {
        let id = req.query.id
        const catdata = await catdb.findById({ _id: id })
        if (catdata.is_block == false) {
            await catdb.updateOne({ _id: id }, { $set: { is_block: true } })
            res.redirect('/admin/category')

        } else {
            await catdb.updateOne({ _id: id }, { $set: { is_block: false } })
            res.redirect('/admin/category')
        }
    } catch (error) {
        console.log(error.message);
    }
}
const orderlist = async (req, res) => {
    try {


        const orderData = await orderdb.find().populate('products.productId')
        res.render('orderlist', { order: orderData })

    } catch (error) {
        console.log(error.message)
    }
}
const orderDetail = async (req, res) => {
    try {
        const user = req.query.id
        const order = await orderdb.findOne({ _id: user }).populate("products.productId")
        res.render('orderDetails', { order, user })

    } catch (error) {
        console.log(error.message)
    }
}
const orderUpdate = async (req, res) => {
    try {

        const orderId = req.body.orderid

        const productId = req.body.proid

        const status = req.body.status
   
        const orderdata = await orderdb.findOneAndUpdate({ _id: orderId, 'products._id': productId },
             {
                $set: {
                    status: status

                }
            })
            
            res.redirect(`/admin/order_details?id=${orderId}`);

    } catch (error) {
        console.log(error.message)
    }
}




module.exports = {
    adminlogin,
    adminverify,
    userlist,
    userBlock,
    adminDashboard,
    loadcategory,
    addcategory,
    catedit,
    catEditPost,
    insert_category,
    catblock,
    orderlist,
    orderDetail,
    orderUpdate

}


