// const Product = require("../Models/product");
// const formidable = require("formidable");
// const _ = require("lodash");
// const fs=require('fs');

// exports.create = (req, res) => {
//     let form = new formidable.IncomingForm();
// form.keepExtensions = true;  // Retains file extensions during parsing
// // form.maxFileSize = 10 * 1024 * 1024; // Set max file size (10 MB)
//     form.parse(req, (err,field,files) => {
//         console.log('Request Fields:',field);
//         console.log('Request Files:',files);
//         if(err){
//             return res.status(400).json({
//                 // error:'Image could not be uploaded'
//                 error:err
//             })
//         }
//         let product = new Product(field)
//        // this files we are getting from client side or frontend
//        if (files.photo) {
//         // console.log("FILES PHOTO: ", files.photo);
//         if (files.photo.size > 1000000) {
//           return res.status(400).json({
//             error: "Image should be less than 1mb in size",
//           });
//         }
//         product.photo.data = fs.readFileSync(files.photo.path); // change path to filepath
//         product.photo.contentType = files.photo.mimetype; // change typt to mimetype
//       }
//         product.save((err,result)=>{
//             if(err){
//                 return res.status(400).json({
//                     error: err
//                 })
//             }
//            res.status(200).json(result);
//         })
//         // try {
//         //     // Save the product
//         //     const result = await product.save(); // This returns the saved document
//         //     return res.status(200).json({result});
//         // } catch (saveErr) {
//         //     return res.status(400).json({ error: saveErr });
//         // }
//     })
// }
const Product = require("../Models/product");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");



exports.productById= async (req,res,next,id)=>{
        try{
            const  product=await Product.findById(id);
            if(!product){
                return res.status(400).json({
                    error: "Product not found"
                });
            }
            req.product=product;
            next();
        } catch(err){
            console.error('Error details:', err);
           res.status(400).json({
            error:{error:"error getting response",err}
           })
        }
}
exports.read=(req,res)=>{
    req.product.photo=undefined //we currently do not send the photo weseperately send photo.
    return res.status(200).json(req.product);
}
exports.userById = async (req, res, next, id) => {
    try {
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(400).json({
                error: "User not found"
            });
        }
        req.profile = user;
        next(); // Continue to the next middleware
    } catch (err) {
        return res.status(400).json({
            error: "Error fetching user"
        });
    }
};



exports.create = (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;  // Retains file extensions during parsing
    form.maxFileSize = 10 * 1024 * 1024; // Set max file size (10 MB)

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Form parsing error:', err);
            return res.status(400).json({ error: 'Image could not be uploaded', details: err });
        }

        // Create a new product instance
        console.log('Fields:', fields);
    console.log('Files:', files);

    if(!fields.name[0]||!fields.description[0]||!fields.price[0]||!fields.quantity[0]||!fields.category[0]||!fields.shipping[0]){
        return res.status(400).json({
            error:"fields are missing"
        })
    }
    const product = new Product({
        name: fields.name[0], // Access the first element of the array
        description: fields.description[0],
        price: Number(fields.price[0]), // Convert to number
        quantity: Number(fields.quantity[0]),
        category: fields.category[0],
        shipping: fields.shipping[0] === '1' // Convert to boolean
    });

        // Handle the uploaded photo
        if (files.photo) {
            if (files.photo.size > 1000000) { // Check if the file size exceeds 1 MB
                return res.status(400).json({ error: "Image should be less than 1 MB in size" });
            }

            // Read the file and store it in the product model
            try {
                product.photo.data = fs.readFileSync(files.photo[0].filepath); // Read the file as a buffer
                product.photo.contentType = files.photo.mimetype; // Store the MIME type
            } catch (fileErr) {
                console.error('File read error:', fileErr);
                return res.status(400).json({ error: 'Error reading file', details: fileErr });
            }
        }

        // Save the product to the database
        try {
            const result = await product.save();
            return res.status(200).json(result);
        } catch (saveErr) {
            console.error('Product save error:', saveErr);
            return res.status(400).json({ error: 'Error saving product', details: saveErr });
        }
    });
};
// exports.remove = (req,res) => {
//     //  try{
//     let product =  req.product;
//     // const deletedProduct = product.remove();
//     product.deleteOne((err,deletedProduct)=>{
//         if(err){
//             return res.status(400).json({
//                 error:"error occured"
//             })
//         }
//         res.status(200).json({
//             deletedProduct,
//             message:"product deleted"
//            })
//     })
           
//     //  }catch(err){
//     //     console.log(err);
//     //     res.status(400).json({
//     //         error:"error occured"
//     //     })
//     //  }
// } 

exports.remove = async (req, res) => {
    const product = req.product; // Access the product from the request

    try {
        // Use the deleteOne method on the model
        const deletedProduct = await Product.deleteOne({ _id: product._id });

        if (deletedProduct.deletedCount === 0) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (err) {
        console.error('Error occurred while deleting product:', err); // Log the error for debugging
        res.status(400).json({
            error: "Error occurred while deleting the product",
            details: err.message // Include the error message for more context
        });
    }
};

exports.update = (req, res) => {
    const form = new formidable.IncomingForm();
    form.keepExtensions = true;  // Retains file extensions during parsing
    form.maxFileSize = 10 * 1024 * 1024; // Set max file size (10 MB)
    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Form parsing error:', err);
            return res.status(400).json({ error: 'Image could not be uploaded', details: err });
        }
        // Create a new product instance
    console.log('Fields:', fields);
    console.log('Files:', files);
    if(!fields.name[0]||!fields.description[0]||!fields.price[0]||!fields.quantity[0]||!fields.category[0]||!fields.shipping[0]){
        return res.status(400).json({
            error:"fields are missing"
        })
    }
    // const product = new Product({
    //     name: fields.name[0], // Access the first element of the array
    //     description: fields.description[0],
    //     price: Number(fields.price[0]), // Convert to number
    //     quantity: Number(fields.quantity[0]),
    //     category: fields.category[0],
    //     shipping: fields.shipping[0] === '1' // Convert to boolean
    // });
    let data={
            name: fields.name[0], // Access the first element of the array
            description: fields.description[0],
            price: Number(fields.price[0]), // Convert to number
            quantity: Number(fields.quantity[0]),
            category: fields.category[0],
            shipping: fields.shipping[0] === '1' // Convert to boolean
        }
    let product = req.product;
    product = _.extend(product, data);

        // Handle the uploaded photo
        if (files.photo) {
            if (files.photo.size > 1000000) { // Check if the file size exceeds 1 MB
                return res.status(400).json({ error: "Image should be less than 1 MB in size" });
            }

            // Read the file and store it in the product model
            try {
                product.photo.data = fs.readFileSync(files.photo[0].filepath); // Read the file as a buffer
                product.photo.contentType = files.photo.mimetype; // Store the MIME type
            } catch (fileErr) {
                console.error('File read error:', fileErr);
                return res.status(400).json({ error: 'Error reading file', details: fileErr });
            }
        }

        // Save the product to the database
        try {
            const result = await product.save();
            return res.status(200).json(result);
        } catch (saveErr) {
            console.error('Product save error:', saveErr);
            return res.status(400).json({ error: 'Error saving product', details: saveErr });
        }
    });
};