const express=require("express");
const router=express.Router();
const {createUser}=require("../controller/UserController");

router.post("/create",createUser);
module.exports = router;
// router mea export kyu kar rahe hain? taki server.js me use kar sake aur usme app.use karke use kar sake.
//router ka kaam hai user route ko handle karna aur usme createUser function ko call karna jab bhi koi post request aaye /user route pe.
//route ko router mea register kar diya hai aur usme createUser function ko pass kar diya hai. jab bhi koi post request aaye /user route pe to createUser function call hoga aur user create hoga.

console.log(createUser);