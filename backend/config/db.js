const mongoose = require("mongoose");

const connectDb= async () =>{
    try{
         mongoose.connect("mongodb://localhost:27017/backend");
        console.log("MongoDB connected successfully");

    }
    catch(error){
        console.log("Error connecting to MongoDB:", error);
    }
}

//agar ye nhi likhi kisi or file m ishse use nhi kar sakte
module.exports=connectDb;