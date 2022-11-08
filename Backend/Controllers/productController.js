
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
        const product = await Product.create({  //key value-pair
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
        res.status(200).json({       //instead of res.send() we wil use this
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
        // {$or:[{},{}]}       $options:'i' is to make query caseinsensitive
        // const getall=await Product.find({name:{$regex:req.query.keyword,$options:'i'}}) //variable data query me jaegi
        // const { page, price } = req.query;
        // const keyword = req.query.keyword ? req.query.keyword : "";
        // const getall = await Product.find(
        //     {
        //         $and: [
        //             {
        //                 "price": {$gt:price}
        //             }, {
        //                 $or: [
        //                     { name: { $regex: keyword, $options: 'i' } },
        //                     { brand: { $regex: keyword, $options: 'i' } }
        //                 ]
        //             }]
        //     }
        // ).limit(resultperpage * 1).skip((page - 1) * resultperpage)

        const resultperpage = 10
        const { keyword, price } = req.query
        const page = req.query.page ? req.query.page : 1
        let priceInString = JSON.stringify(price)


        //regular expression
        // priceInString = priceInString.replace(/\b(gt|lt|gte|lte)\b/g, key => `$${key}`)   //we need not to write $gt $lt again and again
        // console.log(priceInString)
        // let priceInObject = JSON.parse(priceInString)
        // console.log(priceInObject)
        // console.log(!!keyword)        //!!->boolean    !->is for not

        let filter = []
        keyword && filter.push(
            {
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { brand: { $regex: keyword, $options: 'i' } }

                ]
            }
        )

        // filter.push('hii')
        // priceStart && priceEnd && filter.push({ 
        //     price: { $gte: priceStart, $lte: priceEnd } 
        // })

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
        // {$and:[{"price":{$gte:price}},{"p2":{$lte:p2}}]}
        // {"price":{"$gte":100,"$lte":500}}
        // price:{$gte:p1,$lte:p2}






        // console.log(filter)





        // const product=await Product.find()

        // console.log(typeof(page))

        // if (!getall.length) {
        //     res.status(404).json({
        //         message: "Product not Find"
        //     })
        // }

        // // const getall=await Product.find({name:{$regex:req.query.keyword}})
        // res.status(200).json({
        //     getall
        // })


    }
    catch (e) {
        console.log(e)
    }
}


const getAllProductByaggregation = async (req, res) => {
    try {
        const brandName = req.query.brandName
        //macth search that attribute which is present in parent
        // let  {pricel,priceg} = req.query
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
                    //metaData ->it is summary of the data (it tells about count)
                    //Data->it is the actual data
                    //this should be always at the last
                    data:[{$skip:(page-1)*resultPerPage},{$limit:resultPerPage}],
                    metaData:[
                        {$count:"total"}
                    ],
                }
            }
            
            
        ])
        // const product=await Product.aggregate([
        //     { $match:
        //         {$and:[{brand:brand},{price:{$gte:pricegt},price:{$lte:pricelt}}]}
        //     },
        //     {
        //         $lookup:
        //         {
        //             from:"users",
        //             localField:"sellerId",
        //             foreignField:"_id",
        //             as:"Seller Product"
        //         }
        //     }
            // {
            //     $facet:{
            //         product:[{$skip:3},{$limit:5}]
            //     }
            // }
        // ])
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