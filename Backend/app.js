const express=require('express')
const app=express();
const bodyParser=require('body-parser')
const errorMiddleware = require("./Middleware/error")
const cookieParser=require('cookie-parser')

app.use(express.json({       //data will also come in json format
    limit:"50mb",
}))

app.use(bodyParser.urlencoded({
   limit:"50mb",
   extended:true
}))

app.use(cookieParser())    //this is middleware hence we will use this is app.js


const user=require('./Routes/userRoutes')
const product=require('./Routes/productRoutes')

app.use('/api/v1/product',product)
app.use('/api/v1/user',user)
app.use(errorMiddleware)
// app.use(user)
module.exports=app;