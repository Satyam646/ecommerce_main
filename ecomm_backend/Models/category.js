const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema(
    {   name:{
        type : String, 
        trim : true,
        unique:true,
        required: true,
        maxlength : 32,
    }
    },
    { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields  
);
module.exports = mongoose.model("Category", categorySchema);