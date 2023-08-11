const mongoose=require('mongoose');
const address_schema=new mongoose.Schema({
    user_id:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    address:[{
        fname:{
            type:String,
            require:true,
            trim:true
        },
       
        email:{
            type:String,
            required:true,
            trim:true
        },
        phone:{
            type:Number,
            required:true,
            trim:true
        },
        address:{
            type:String,
            required:true,
            trim:true
        },
        state:{
            type:String,
            required:true,
            trim:true
        },
        pin:{
            type:Number,
            required:true,
            trim:true
            
        },

    }]

});
module.exports=mongoose.model('useraddress',address_schema)