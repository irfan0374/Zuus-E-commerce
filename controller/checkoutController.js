const addressdb = require('../model/addressModel')
const userdb = require('../model/userModel')
const cartdb = require('../model/cartModel')
const Orderdb = require('../model/orderModel')
const productdb = require('../model/productModel')
const razorpay = require('razorpay');

var instance = new razorpay({
    key_id: "rzp_test_LUK6qKTry34nlK",
    key_secret: process.env.Razorpay_SECRET_KEY,
});

const orderplaced = async (req, res) => {
    try {
        const user = req.session.userId
        const orderdata = await Orderdb.findOne({ user: user }).populate('products.productId').sort({ date: -1 })
        res.render('orderplaces', { orderdata })

    } catch (error) {
        console.log(error.message)
    }
}

const postCheckoutload = async (req, res) => {
    try {

        const { total, address, payment } = req.body
        let status = payment == "cod" ? 'placed' : 'pending'

        const user = req.session.userId
        const User = await userdb.findOne({ _id: user })
        const cart = await cartdb.findOne({ userId: user })

        const cartdata = cart.product;

        const orderDate = new Date();
        const delivery = new Date(orderDate.getTime() + (10 * 24 * 60 * 60 * 1000)); // Add 10 days to the order date
        const deliveryDate = delivery.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).replace(/\//g, '-');

        const newOrder = new Orderdb({
            user: user,
            deliveryAddress: address,
            userName: User.name,
            totalAmount: total,
            status: status,
            date: orderDate,
            payment: payment,
            products: cartdata,
            expectedDelivery: deliveryDate
        })
        const orderData = await newOrder.save()

        const orderId = orderData._id
        if (status == "placed") {
            for (let i = 0; i < cartdata.length; i++) {
                await productdb.findByIdAndUpdate({ _id: cartdata[i].productId }, { $inc: { stock: -cartdata[i].quantity } })
            }
            await cartdb.deleteOne({ userId: user })
            res.json({ codSuccess: true, params: orderId })
        } else {
            const total = orderData.totalAmount

            var options = {
                amount: total * 100,
                currency: 'INR',
                receipt: '' + orderId,
            };


            instance.orders.create(options, function (err, order) {
               
                res.json({ order });

            });
        }

    } catch (error) {
        console.log(error.message)
    }
}
const checkoutaddress = async (req, res) => {
    try {
        const user = req.session.userId
        res.render('checkoutaddress', { user })

    } catch (error) {
        res.redirect('/error')
        console.log(error.message)
    }
}
const postcheckoutaddress = async (req, res) => {
    try {

        const user = req.session.userId
        const maxAddress = 2;
        const addressdata = await addressdb.findOne({ user_id: user })
        if (addressdata) {
            if (addressdata.address.length < maxAddress) {
                await addressdb.updateOne({ user_id: user },
                    {
                        $push: {
                            address: {
                                fname: req.body.fname,
                                phone: req.body.phone,
                                email: req.body.email,
                                state: req.body.state,
                                address: req.body.address,
                                pin: req.body.pin,
                            },
                        },
                    });

                res.redirect('/checkoutload');


            } else {
                await addressdb.updateOne(
                    { user_id: user },
                    {
                        $push: {
                            address: {
                                $each: [
                                    {

                                        lname: req.body.lname,
                                        phone: req.body.phone,
                                        email: req.body.email,
                                        address: req.body.address,
                                        pin: req.body.pin,
                                    },
                                ],
                                $slice: -maxAddress,
                            },
                        },
                    }
                );



                res.redirect('/checkoutload')

            }


        } else {
            const data = new addressdb({
                user_id: user,
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
                res.redirect('/checkoutload')
            } else {
                res.render('/add_address1', { message: 'something error' })
            }
        }
    }
    catch (error) {
        res.redirect("/error");
        console.log(error.message);
    }
}
const verifypayment = async (req, res) => {
    try {
        let userData = await userdb.findOne({ _id: req.session.userId })
        const details = req.body;
        const crypto = require("crypto");
        let hmac = crypto.createHmac("sha256", process.env.Razorpay_SECRET_KEY);

        hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]'])
        hmac = hmac.digest('hex')
        if (hmac == details['payment[razorpay_signature]']) {
            const items = await Orderdb.findByIdAndUpdate(
                { _id: details['order[receipt]'] },
                { $set: { paymentId: details['payment[razorpay_payment_id]'] } }
            );
            await Orderdb.findByIdAndUpdate(
                { _id: details['order[receipt]'] },
                { $set: { status: "Placed" } }
            );

            for (let item of items.products) {
                await productdb.updateOne(
                    { _id: item.productId },
                    { $inc: { stock: -item.quantity } }
                );
            }
            await cartdb.deleteOne({ userId: req.session.userId });
            res.json({ success: true })
        }

    } catch (error) {
        console.log(error.message)
    }
}
module.exports = {
    orderplaced,
    postCheckoutload,
    checkoutaddress,
    postcheckoutaddress,
    verifypayment


} 
