const mongoose=require('mongoose')
const bannerSchema=new mongoose.Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    images:{
        type:Array,
        require:true
    },
    unlist:{
        type:Boolean,
        default:false
    }

},
{
    timestamps:true
}
);
module.exports=mongoose.model('banner',bannerSchema)