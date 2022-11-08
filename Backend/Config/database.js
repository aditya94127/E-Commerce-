const mongoose= require('mongoose')
// const dotenv=require('dotenv')
// console.log(dotenv)
// dotenv.config({
//     path:'./.env'// })
// console.log(process.env.MONGO_URL)

const connection=()=>{
    mongoose.connect(process.env.MONGO_URL).then((res)=>console.log('connection successfull')).catch((err)=>console.log(err))
}

// connection();
module.exports=connection;