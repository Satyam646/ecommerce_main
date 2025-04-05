const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {   name:{
        type : String, 
        trim : true,
        unique:true,
        required: true,
        maxlength : 32,
    }
        // name: {
        //     type: String,
        //     trim: true,
        //     unique: true ["Category name must unique"],
        //     required: [true, "Category name is required"], // Custom error message
        //     maxlength: [32, "Category name must be at most 32 characters long"], // Custom error message
        // },
    },
    { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields  
);

module.exports = mongoose.model("Category", categorySchema);