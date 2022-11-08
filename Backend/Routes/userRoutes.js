const express=require('express')
const {isauthenticateuser,isAdmin}=require('../Middleware/auth')
const router=express.Router()  //router is the property of express
const {findOne,Delete,findAll,deletebyid,login,test,logout, userRegister,changePassword,updateDetail,makeAdmin,removeAdmin}=require('../Controllers/userController')

router.route('/login').post(login)  
router.route('/test').post(test)  
router.route('/register').post(userRegister) 
router.route('/findone').get(findOne)
router.route('/find').get(isauthenticateuser,isAdmin,findAll)
//end point
// router.route('/get').get(get)
router.route('/logout').get(logout)
router.route('/delete').delete(Delete)
router.route('/deletebyid/:_id').delete(deletebyid)
router.route('/changePassword').post(isauthenticateuser,changePassword)
router.route('/update').post(isauthenticateuser,updateDetail)
router.route('/admin/:_id').post(isauthenticateuser,isAdmin,makeAdmin)
router.route('/removeAdmin/:_id').post(isauthenticateuser,isAdmin,removeAdmin)
module.exports=router;