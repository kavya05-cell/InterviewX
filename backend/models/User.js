
const mongoose=require("mongoose");
const UserModel= new mongoose.Schema({

    first_name:{type:String,required:true},
//default ishliye kuki last name optional hota hai
//email empty nhi hona  chaiye
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
//date apne aap add ho jayegi
    created_at:{type:Date,default:Date.now}
});

const User= mongoose.model("UserSchema",UserModel);

module.exports = User;