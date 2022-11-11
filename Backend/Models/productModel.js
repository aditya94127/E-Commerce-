const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({
    brand: {
        type: String,
    },
    category: {
        type: String,
    },
    name: {
        type: String,
    },
    imageUrl: {
        type: String
    },
    stock: {
        type: Number,
    },
    price: {
        type: Number,
    },
    color: {
        type: String,
    },
    rating: {
        type: String,
    },
    size: {
        type: Number,
    },
    description: {
        type: String
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'User'
    }
})
module.exports = new mongoose.model("product", productSchema)