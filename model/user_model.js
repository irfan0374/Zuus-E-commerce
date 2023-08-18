const mongoose = require("mongoose");

const userschema = mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   phone: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   is_verified:
   {
      type: Number,
      default: 0
   },
   is_block: {
      type: Boolean,
      default: false
   },
   is_admin: {
      type: Number,
      default: 0
   },
   wallet:{
      type:Number,
      defalut:0
   },
   walletHistory: [
      {
        date: {
          type: Date,
        },
        amount: {
          type: Number,
        },
        description: {
          type: String,
        },
      },
    ],

},
{
   timestamps:true
})

module.exports = mongoose.model("User", userschema)
