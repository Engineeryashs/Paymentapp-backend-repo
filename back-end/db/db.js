const mongoose=require("mongoose");
require("dotenv").config();
const mongodbUri=process.env.MONGODB_URI;
const JWT_SECRET=process.env.JWT_SECRET;
console.log("HI"+mongodbUri)
console.log("Hello"+JWT_SECRET)
mongoose.connect(mongodbUri)
const userSchema=new mongoose.Schema({
    name:String,
    lastName:String,
    userName:String,
    password:String,
})

const accountSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    balance:{
        type:Number,
        required:true,
    }
})

const User=mongoose.model("User",userSchema);
const Account=mongoose.model("Account",accountSchema)
module.exports={
    User,
    Account
}