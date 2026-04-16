const UserSchema = require("../models/User");
const bcrypt=require("bcrypt");

const  createUser= async (req, res) => {
    try {
        const { first_name, email, password} = req.body;
        const existingUser=await UserSchema.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            });
        }
        // UserSchema.findOne({ email }).then((existingUser) => {
        //     if (existingUser) {
        //         return res.status(400).json({
        //             status: "failed",
        //             message: "User already exists"
        //         });
        //     }
        // });
        const hashedPassword = await bcrypt.hash(password, 10);

        // Validation
        if (!first_name || !email || !hashedPassword) {
            return res.status(400).json({
                status: "failed",
                message: "All fields are required"
            });
        }

        // Create and Save
        const newschema = await UserSchema.create({
            first_name,
            email,
            hashedPassword
        });


        // Success response
        return res.status(201).json({
            status: "success",
            message: "User has been registered successfully",
            data: newschema
        });

    } catch (error) {
        console.error(error);
        if(error.code === 11000) { // Duplicate key error
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                message:`${field} already exists. Please use a different ${field}.`
            });
        }
        return res.status(500).json({
            status: "error",
            message: `Some error occurred: ${error.message}`
        });
    }
};

module.exports = { createUser };