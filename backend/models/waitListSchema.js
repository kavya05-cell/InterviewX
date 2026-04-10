
const mongoose=require("mongoose");
const waitListSchema= new mongoose.Schema({

    first_name:{type:String,required:true},
//defaulkt ishliye kuki last name optional hota hai
    last_name:{type:String,default:""},
//email cannot nhi hona  chaiye
    email:{type:String,required:true,unique:true},
    phone_no:{type:String,required:true,unique:true},
    reason:{type:String,required:true},
//data apne aap add ho jayegi
    created_at:{type:Date,default:Date.now}
});

const waitListModel= mongoose.model("waitlist",waitListSchema);

module.exports = waitListModel;