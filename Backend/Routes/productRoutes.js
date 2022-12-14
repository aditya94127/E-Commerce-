const express=require('express')
const router=express.Router();
const {deleteReview,getProductReview,create,productDetail,getallProducts,deleteProduct,productDetails,updateProduct,getAllProductByaggregation}=require('../Controllers/productController')
const {isauthenticateuser}=require('../Middleware/auth')
router.route('/create').post(isauthenticateuser,create)
router.route('/allproduct').get(getallProducts)
router.route('/detail/:_id').get(productDetail)
router.route('/delete/:_id').delete(isauthenticateuser,deleteProduct)
router.route('/getproductdetails').get(productDetails)
router.route('/update/:_id').patch(isauthenticateuser,updateProduct)
router.route('/rating/:_id').post(isauthenticateuser)
router.route('/getproductrating/:_id').get(getProductReview)
router.route('/updaterating/:_id').delete(deleteReview)
router.route('/getAllProductByaggregation').get(getAllProductByaggregation)
module.exports=router