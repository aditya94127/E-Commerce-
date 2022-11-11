
const Product = require('../Models/productModel')
const JWT = require('jsonwebtoken')
const isauthenticateuser = require('..//Middleware/auth')
const userModel = require('../Models/userModel')
const { query } = require('express')
const catchAsyncErrors = require('../Middleware/catchAsyncErrors')
const ErrorHandler = require('../Utils/errorHandler')
const create = async (req, res) => {
    try {
        console.log(req.user)
        const product = await Product.create({  
            brand: req.body.brand,
            category: req.body.category,
            name: req.body.name,
            imageUrl: req.body.imageUrl,
            stock: req.body.stock,
            price: req.body.price,
            color: req.body.color,
            rating: req.body.rating,
            size: req.body.size,
            description: req.body.description,
            sellerId: req.user._id

        })
        res.status(200).json({       
            success: true,
            product: product
        })
    }
    catch (e) {
        console.log(e)
    }
}

const productDetail = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params._id).populate('sellerId')
    if (!product) {
        return next(new ErrorHandler("product not found", 404))
    }
    res.json({
        product
    })

})



const getallProducts = async (req, res) => {
    try {
        const resultperpage = 10
        const { keyword, price } = req.query
        const page = req.query.page ? req.query.page : 1
        let priceInString = JSON.stringify(price)

        let filter = []
        keyword && filter.push(
            {
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { brand: { $regex: keyword, $options: 'i' } }

                ]
            }
        )

        price && filter.push({
            "price": priceInObject

        })


        const getall = await Product.find(
            filter.length ? {
                $and: filter
            } : {}).limit(resultperpage * 1).skip((page - 1) * resultperpage)
        res.json({
            getall
        })
    }
    catch (e) {
        console.log(e)
    }
}


const getAllProductByaggregation = async (req, res) => {
    try {
        const brandName = req.query.brandName
        const pricegt = Number(req.query.pricegt)
        const pricelt = Number(req.query.pricelt)
        const resultPerPage=5;
        const page = req.query.page ? req.query.page : 1
        const product = await Product.aggregate([
            {

                $match: {
                    $and: [
                        { brand:brandName },
                        {
                            price: { $gte: pricegt , $lte: pricelt}
                        }
                    ]
                }
            },
            
            {
                $lookup:
                {
                    from: "users",
                    localField: "sellerId",
                    foreignField: "_id",
                    as: "Seller Product"
                }
            },

            {
                $facet:{
                    data:[{$skip:(page-1)*resultPerPage},{$limit:resultPerPage}],
                    metaData:[
                        {$count:"total"}
                    ],
                }
            }
            
            
        ])
        
        res.json({
            product
        })
    }
    catch (e) {
        console.log(e)
    }
}




const deleteProduct = async (req, res) => {
    try {
        const remove = await Product.findByIdAndDelete(req.params._id)
        res.status(200).json({
            message: "Product removed successfully"
        })
    }
    catch (e) {
        console.log(e)
    }
}

const productDetails = async (req, res) => {
    try {
        const detail = await Product.find()
        {
            
            res.status(200).json({
                detail
            })
        }
        
    }
    catch (e) {
        console.log(e)
    }
}


const updateProduct = async (req, res) => {
    try {
        const upDate = await Product.find({ _id: req.params._id })
        // console.log(upDate.length)
        if (upDate.length) {
            const updateproduct = await Product.updateOne(req.body)
            res.status(200).json({
                updateproduct,
                message: "Product has been updated"
            })
        }
        else {
            res.status(404).json({
                message: "Product not found"
            })
        }
    }
    catch (e) {
        console.log(e)
    }
}



const getProductReview = async (req, res) => {
    try {
        const productId = req.params._id
        const review = await Product.findById(productId).populate('rating')
        res.status(200).json({
            review
        })
    }
    catch (e) {
        console.log(e)
    }
}

const deleteReview = async (req, res) => {
    try {
        const productId = req.params._id
        const review = await Product.updateOne({ productId }, { $unset: { "rating": "" } })
        res.status(200).json({
            review
        })
    }
    catch (e) {
        console.log(e)
    }
}


module.exports = { getProductReview, create, productDetail, getallProducts, deleteProduct, productDetails, updateProduct, deleteReview, getAllProductByaggregation }