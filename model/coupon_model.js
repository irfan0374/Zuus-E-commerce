const mongoose=require('mongoose')
const couponSchema=new mongoose.Schema({

    code:{
        type:String,
        required:true
    },
    dicountType:{
        type:String,
        required:true
    },
    user:{
        type:String,
        ref:'User'
    },
    startDate:{
        type:Date,
        required:true
    },
    expiredDate:{
        type:Date,
        required:true
    },
    used:{
        type:Array
    },
    minCartAmt:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true

    },
    status:{
        type:Boolean,
        defalut:false
    }


})

module.exports=mongoose.model('coupon',couponSchema)