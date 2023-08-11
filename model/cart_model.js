const mongoose = require('mongoose')
const cart_schema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coupon:{
        type:String,
        default:false
    },
    product: [
        {
        productId: {
            type: mongoose.Types.ObjectId,
            ref: 'product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1,

        },
        price: {
            type: Number,
            default: 0
        },

        total:{
            type:Number,
            required:true
        }
    }]

})
module.exports = mongoose.model('cart', cart_schema);