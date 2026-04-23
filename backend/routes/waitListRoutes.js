const express=require("express");
const router=express.Router();
const {createWaitlist}=require("../controller/waitListController");

router.post("/create",createWaitlist);
module.exports = router;
// router mea export kyu kar rahe hain? taki server.js me use kar sake aur usme app.use karke use kar sake.
//router ka kaam hai waitlist route ko handle karna aur usme createWaitlist function ko call karna jab bhi koi post request aaye /waitlist route pe.
//route ko router mea register kar diya hai aur usme createWaitlist function ko pass kar diya hai. jab bhi koi post request aaye /waitlist route pe to createWaitlist function call hoga aur waitlist create hoga.

console.log(createWaitlist);