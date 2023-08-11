const mongoose=require('mongoose');
const wishlist =new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    products:[{
        productsId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'product',
            required:true
        }
    }]
})
module.exports=mongoose.model('wishlist',wishlist)