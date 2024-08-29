const express=require("express");
const mainRouter=require("./routes/index")
const cors=require("cors")
const jwt=require("jsonwebtoken");
const app=express();
require('dotenv').config();
app.use(cors());
app.use(express.json());
const port=3000||process.env.port;
app.use("/api/v1",mainRouter)
app.listen(port,()=>{
    console.log(`App is listening on the ${port}`)
})







