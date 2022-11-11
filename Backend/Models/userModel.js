const mongoose=require('mongoose')
const validator=require('validator')
const JWT=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const userSchema=new mongoose.Schema({
    
    email:{
        type:String,
        validate:[validator.isEmail,"Please Enter Valid E-mail"],
        unique:true,
        required:true
    },

    password:{
        type:String,
        required:true,
        minlength:[8,"Password not Strong"],
        select:false    //to make the password confidentially

    },
    isadmin:{
        type:Boolean,
        default:false
    }
    
})


//to put jwt token in cookies
userSchema.methods.getJWTToken=function(){
    return JWT.sign({id:this._id},process.env.JWT_SECRET_KEY)   
}


userSchema.pre("save",async function(next){
    if(!this.isModified("password")){ 
        next();
    }
    this.password=await bcrypt.hash(this.password,10)

})

userSchema.methods.comparePassword=async function (password){
   return await bcrypt.compare(password,this.password)
}

module.exports=new mongoose.model("User",userSchema)    

