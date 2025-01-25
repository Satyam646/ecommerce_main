const mongoose = require("mongoose");
const Category = require("./category");
const {ObjectId} = mongoose.Schema


const productSchema=new mongoose.Schema({
    name:{
     type:String,
     trim:true,
     require:true,
     maxlength: 32
    },
    description:{
        type:String,
        require:true,
        maxlength:2000,
    },
    price:{
        type:Number,
        trim:true,
        require:true,
        maxlength:32
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,                   
    },
    quantity:{
        type:Number
    },
    photo: {
        data:Buffer,  //It is use to store raw binary data.
        contentType:String,
    },
    sold:{
       type:Number,
       default:0
    },
    shipping:{
     type:Boolean,
     require:false   
    }
},{timestamps:true}
);

module.exports = mongoose.model("Product",productSchema);