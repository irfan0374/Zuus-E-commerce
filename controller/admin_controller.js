const admin = require("../model/admin_model");
const productdb = require("../model/product_model");
const User = require('../model/user_model');
const catdb = require('../model/category_model')
const orderdb = require('../model/orderModel')
const bcrypt = require('bcrypt');
const moment = require('moment')
const SALES_PER_PAGE = 10

// adminlogin
const adminlogin = async (req, res) => {
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }

}
const logout=async(req,res)=>{
    try{
        console.log("enter")
        req.session.destroy()
        res.render('login')

    }catch(error){
        console.log(error.message)
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
                    req.session.adminId = email
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

const adminDashboard = async (req, res) => {
    try {

        const ordercount = await orderdb.countDocuments()
        const productcount = await productdb.countDocuments()
        const categoryCount=await catdb.countDocuments()
        const Usercount = await User.countDocuments()
        const cancelcount = await orderdb.find({ status: "Cancelled" }).count()
        const deliveredcount = await orderdb.find({ status: "delivered" }).count()
        const placedcount = await orderdb.find({ status: "placed" }).count()
        let currentDate = new Date();
        currentDate.setHours(0);
        currentDate.setMinutes(0);
        currentDate.setSeconds(0);
        currentDate.setMilliseconds(0);

    //     let todayRevenue = await orderdb.aggregate([
    //   {
    //     $match: {
    //       status: { $ne: "Cancelled" },
    //       createdAt: { $gte: currentDate },
    //     },
    //   },
    //   {
    //     $group: { _id: null, total: { $sum: "$totalAmount" }, count: { $sum: 1 } },
    //   },
    // ]);
    //    
    //     if (todayRevenue === 0) {
    //         todayRevenue.push({ _id: null, total: 0, count: 0 })
    //     }
       const startOfTheWeek = new Date(currentDate);
startOfTheWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Adjusted calculation for the start of the week
const endOfTheWeek = new Date(currentDate);
endOfTheWeek.setDate(startOfTheWeek.getDate() + 6);

const currentWeekRevenue = await orderdb.aggregate([
    {
        $match: {
            status: { $ne: "Cancelled" },
            createdAt: { $lte: endOfTheWeek },
        },
    },
    {
        $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } }
    }
]);

  
        if (currentWeekRevenue === 0) {
            currentWeekRevenue.push({ _id: null, total: 0, count: 0 })
        }
        const totalrevenue = await orderdb.aggregate([
            {
                $match: { status: { $ne: "Cancelled" } }
            },
            {
                $group: {
                    _id: null, total: { $sum: '$totalAmount' }

                }
            }
        ]);
        if (totalrevenue === 0) {
            totalrevenue.push({ _id: null, total: 0, count: 0 })
        }
        const currentMonth = new Date().getMonth() + 1;
        const monthlyRevenue = await orderdb.aggregate([
            {
                $match: {
                    status: { $ne: "Cancelled" },
                    $expr: { $eq: [{ $month: "$createdAt" }, currentMonth] }
                }
            },
            {
                $group: {
                    _id: null,
                    earnings: { $sum: "$totalAmount" }
                }
            }
        ]);
        if (monthlyRevenue === 0) {
            monthlyRevenue.push({ _id: 0, total: 0, count: 0 })
        }

        let sales = []
        let users = []
        let date = new Date()
        let year = date.getFullYear()
        let currentYear = new Date(year, 0, 1)
        let salesByYear = await orderdb.aggregate([
            {
                $match: {
                    status: { $ne: "Cancelled" }
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%m", date: "$createdAt" } },
                    total: { $sum: "$totalAmount" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } }
        ]);

        for (let i = 1; i <= 12; i++) {
            let result = true
            for (let j = 0; j < salesByYear.length; j++) {
                result = false
                if (salesByYear[j]._id == i) {
                    sales.push(salesByYear[j]);
                    break;

                } else {
                    result = true
                }
            }
            if (result) sales.push({ _id: i, total: 0, count: 0 })
        }
        let salesData = [];
        for (let i = 0; i < sales.length; i++) {
            salesData.push(sales[i].total)
        }
        let userByYear = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: currentYear }, is_block: { $ne: true }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%m", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } }
        ])
     
        for (let i = 1; i <= 12; i++) {
            let result = true
            for (let j = 0; j < userByYear.length; j++) {
                result = false
                if (userByYear[j]._id == i) {
                    users.push(userByYear[j])
                    break;
                } else {
                    result = true
                }
            }
            if (result) { users.push({ _id: i, count: 0 }) }
        }
       
        let userdata = []
        for (let i = 0; i < users.length; i++) {
            userdata.push(users[i].count)
        }
      
        
        res.render('home', {
            // todayRevenue,
            currentWeekRevenue,
            totalrevenue,
            monthlyRevenue,
            salesByYear,
            userByYear,
            ordercount,
            Usercount,
            deliveredcount,
            placedcount,
            productcount,
            categoryCount,
            cancelcount,
            salesData,
            userdata
        })
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
const salesReportload = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const totalOrders = await orderdb.countDocuments()
        const totalPage = Math.ceil(totalOrders / SALES_PER_PAGE)
        const order = await orderdb.find({ status: "delivered" })
            .skip((page - 1) * SALES_PER_PAGE)
            .limit(SALES_PER_PAGE)
            .sort({ createdAt: -1 })
            .populate('products.productId')
      
        res.render('salesReport', { order, totalPage, moment, req })

    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    adminlogin,
    logout,
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
    orderUpdate,
    salesReportload

}


