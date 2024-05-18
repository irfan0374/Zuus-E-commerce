const mongoose=require('mongoose');
const category_schema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    is_block:{
        type:Boolean,
        default:false
    }
})
module.exports=mongoose.model('category',category_schema)