// const express=require('express') 
const dotenv=require('dotenv')
// const app=express();
const connection=require('./Config/database')
const app=require('./app')

process.on("uncaughtException",(err) => {
      console.log(`Error: ${err}`);
      console.log('Shutting the server due to UnCaught Exception');
      process.exit(1); // to get exit
  })

dotenv.config({  
      path:'./Config/.env'
})
connection();
// console.log(process.env.PORT)

// app.get('/page',(req,res)=>{
//     res.send("hi this is robbie")
// })

const server=app.listen(process.env.PORT,(()=>console.log('connection')))


process.on("unhandledRejection",err=>{
      console.log(`Error: ${err.message}`);
      console.log('Shutting the server due to UnHandled Promise Rejection');
  
      server.close(() => {
          process.exit(1);
      });
  })
