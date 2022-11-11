const userModel = require('../Models/userModel');
const User=require('../Models/userModel')   
const JWT=require('jsonwebtoken')


const test=async (req,res)=>{
    try{
        
        const token=JWT.sign("Aditya",process.env.JWT_SECRET_KEY)    //encrypt generation of token
        const verify=JWT.verify(token,process.env.JWT_SECRET_KEY)    //decrpyt
        res.json({
            token:token,
            data:verify
        })
    }
    catch(e){
        console.log(e)
    }
}

const userRegister=async (req,res)=>{
    try{

        if(req.body.confirmPassword!=req.body.password){
             res.send("password doesnot match")
             return
        }
        const user=await User.create({ 
          
            email:req.body.email,
            password:req.body.password,
            isadmin:req.body.isadmin,
            confirmPassword:req.body.confirmPassword,
        })
        res.status(200).json({message:"user registered successfull"})
    }
    catch(e){
        console.log(e)
        res.send("user already exist")
    }
}


const login=async(req,res)=>{
    try{
        
     const user=await  User.findOne({email:req.body.email}).select("+password") 
   
    if(user!=null){       
          const isPasswordMatched=await user.comparePassword(req.body.password)
        
       
         if(!isPasswordMatched){
            res.json({message:"email and password not matched"})

        }
      else{
        res.json({
            user,message:"User logged in successfully"})
      }
    }
    else{
        res.json({message:"User does not exist"})
    }
 }
    catch(e){
        console.log(e)
    }
}


const changePassword=async(req,res)=>{
    try{
        
        const user=await User.findById({_id:req.user._id})
        user.password=req.body.newPassword
        await user.save()        
        res.json({message:"Password changed Successfully"})
    }
    catch(e){
        console.log(e)
    }
}

const updateDetail =async(req,res)=>{
    try{
        const user=await User.findById({_id:JWT.verify(req.cookies.token,process.env.JWT_SECRET_KEY).id})
        console.log(user)
        
        if(user){
            const updateUser= await User.updateOne({_id:user._id},req.body)
         res.json({
            updateUser,
            message:"User detail changed successfully"})
        }
        else{
            res.json({message:"User doesnot exist"})
        }
    }
    catch(e){
        console.log(e)
    }
}


const logout =async(req,res)=>{
    try{
        res.clearCookie("token").json({
            message:'User logged Out Successfully'
        })
    }
    catch(e){
        console.log(e)
    }
}

const findOne=async(req,res)=>{
    try{
      const findone=await  User.findOne({email:{$gt:201}}, 
            );  
    }
    catch(e){
        console.log(e)
    }
}

const findAll=async(req,res)=>{
    try{
      const users=await  User.find();  
      res.status(200).json({success:true,
    users})
    }
    catch(e){
        console.log(e)
    }
}


const Delete=async(req,res)=>{
    try{
        const deltemany=await  User.deleteMany({StudentId:201}, 
            function(err, data) {
                if(err){
                    console.log(err);
                }
                else{
                    res.send(data);
                }
            });  
    }
    catch(e){
        console.log(e)
    }
}

const deletebyid=async (req,res)=>{
    try{
        const DeletebyId=await  User.findByIdAndDelete(req.params._id)
        res.status(200).json({
            message:"User deleted successfully"
        })
    }
    catch(e){
        console.log(e)
    }
}

const makeAdmin=async (req,res)=>{
    try{
        const user=await User.findById(req.params._id)
        if(!user.isadmin){
            await User.findByIdAndUpdate(req.params._id,{isadmin:true}) 
            res.status(200).json({
                message:"User has become admin"
            })
        }
        else{
            res.json({
                message:"User is already a admin"
            })
        } 
    }
    catch(e){
        console.log(e)
    }
}

const removeAdmin=async (req,res)=>{
    try{
        const user=await User.findById(req.params._id)
        if(user.isadmin){
            await User.findByIdAndUpdate(req.params._id,{isadmin:false}) 
            res.status(200).json({
                message:"User is no longer admin"
            })
        }
        else{
            res.json({
                message:"User was not admin"
            })
        } 
    }
    catch(e){
        console.log(e)
    }
}



module.exports={removeAdmin,userRegister,findOne,Delete,findAll,deletebyid,login,test,logout,changePassword,updateDetail,makeAdmin}
