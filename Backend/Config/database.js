const mongoose= require('mongoose')


const connection=()=>{
    mongoose.connect(process.env.MONGO_URL).then((res)=>console.log('connection successfull')).catch((err)=>console.log(err))
}

// connection();
module.exports=connection;