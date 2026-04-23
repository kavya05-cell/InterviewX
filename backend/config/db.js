
require("dotenv").config();
const mongoose = require("mongoose");

const connectDb= async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");

    }
    catch(error){
        console.log("Error connecting to MongoDB:", error);
    }
}

//agar ye nhi likhi kisi or file m isse use nhi kar sakte
module.exports=connectDb;
