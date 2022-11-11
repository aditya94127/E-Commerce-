const dotenv=require('dotenv')
const connection=require('./Config/database')
const app=require('./app')

process.on("uncaughtException",(err) => {
      console.log(`Error: ${err}`);
      console.log('Shutting the server due to UnCaught Exception');
      process.exit(1); 
  })

dotenv.config({  
      path:'./Config/.env'
})
connection();


const server=app.listen(process.env.PORT,(()=>console.log('connection')))


process.on("unhandledRejection",err=>{
      console.log(`Error: ${err.message}`);
      console.log('Shutting the server due to UnHandled Promise Rejection');
  
      server.close(() => {
          process.exit(1);
      });
  })
