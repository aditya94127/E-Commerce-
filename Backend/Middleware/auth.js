const JWT=require('jsonwebtoken')
const User=require('../Models/userModel')


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
       
        req.user=await User.findById(decodeToken.id)  
        
        next()
    }
    catch(e){
        console.log(e)
    }
}

module.exports={isauthenticateuser,isAdmin}



