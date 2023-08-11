const mongoose = require('mongoose');
const productschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discription: {
        type: String,
        required: true
    },
    image: {
        type: Array
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true

    },
    is_block: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('product', productschema)