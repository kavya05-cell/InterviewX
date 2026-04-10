const waitListModel = require("../models/waitListSchema");

const createWaitlist = async (req, res) => {
    try {
        const { first_name, last_name, email, phone_no, reason } = req.body;

        // Validation
        if (!first_name || !last_name || !email || !phone_no || !reason) {
            return res.status(400).json({
                status: "failed",
                message: "All fields are required"
            });
        }

        // Create and Save
        const newWaitlist = new waitListModel({
            first_name,
            last_name,
            email,
            phone_no,
            reason
        });

        await newWaitlist.save();

        // Success response
        return res.status(201).json({
            status: "success",
            message: "Waitlist created successfully",
            data: newWaitlist
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

module.exports = { createWaitlist };