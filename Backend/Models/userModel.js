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
    // email:{
    //     type:String
    // // },
    // Birthday:{
    //     type:String
    // }
    
})


//to put jwt token in cookies
userSchema.methods.getJWTToken=function(){
    return JWT.sign({id:this._id},process.env.JWT_SECRET_KEY)   //_id is of mongodb
}
// const unserDetail=mongoose.model('userDetail',userInfo)

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){ // this is used to prevent the password from again hashing itself while we update the user data.
        next();
    }
    
    //hash -> for register

    this.password=await bcrypt.hash(this.password,10)

})

//compare-> for login
userSchema.methods.comparePassword=async function (password){
   return await bcrypt.compare(password,this.password)
}

module.exports=new mongoose.model("User",userSchema)    //user is table name and second parameter is schema (attributes)to define the defination of 

