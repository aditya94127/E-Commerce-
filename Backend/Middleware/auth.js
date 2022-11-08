const JWT=require('jsonwebtoken')
const User=require('../Models/userModel')
// const isauthenticateuser=async (req,res,next)=>{
//     try{
//         // console.log(req)
//         // console.log(req.cookies)
//         // console.log(req.cookies.token)
//         // const {cookies}=req     //for destructuring we use {}
//         // console.log(cookies)
//         const {token}=req.cookies     //tree branch example

//         if(!token){   //if token doesnot exist
//             res.status(401).json({
//                 message:"Please Login"
//             })
//         }
//         const decodeToken=JWT.verify(token,process.env.JWT_SECRET_KEY)
//         req.user=await User.findById(decodeToken.id)   //
//         next()
//         console.log(decodeToken)

//         // console.log(token)
//     }
//     catch(e){
//         console.log(e)
//     }
// }

const isAdmin=async(req,res,next)=>{
    try{
        if(req.user.isadmin){
            next()
        }
        else{
            res.status(401).json({
                message:"Unauthorised access"
            })
        }
    }
    catch(e){
        console.log(e)
    }
}

const isauthenticateuser=async (req,res,next)=>{
    try{
        const {token}=req.cookies
        if(!token){
            res.status(401).json({
                message:"Please Login"
            })
        }
        const decodeToken=JWT.verify(token,process.env.JWT_SECRET_KEY)
        // console.log(decodeToken)
        req.user=await User.findById(decodeToken.id)  //if we want to access the variables of another function we use req.user. router.route('/changePassword').post(isauthenticateuser,changePassword)
        // console.log(req.user)
        next()
    }
    catch(e){
        console.log(e)
    }
}

module.exports={isauthenticateuser,isAdmin}



