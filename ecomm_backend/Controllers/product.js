const mongoose = require('mongoose');
const Product = require("../Models/product");
const User=require("../Models/users");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");
exports.productById= async (req,res,next,id)=>{
        try{
            const  product=await Product.findById(id).populate("category");
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
exports.create = (req, res) => {
    const form = new formidable.IncomingForm();
    console.log("dhi",form);
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
    console.log("ff",product);
        // Handle the uploaded photo
        if (files.photo) {
            if (files.photo.size > 1000000) { // Check if the file size exceeds 1 MB
                return res.status(400).json({ error: "Image should be less than 1 MB in size" });
            }
            // Read the file and store it in the product model
            try {
                product.photo.data = fs.readFileSync(files.photo[0].filepath); // Read the file as a buffer
                product.photo.contentType = files.photo[0].mimetype; // Store the MIME type
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
        console.log(err);
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
    let data={
            name: fields?.name[0], // Access the first element of the array
            description: fields?.description[0],
            price: Number(fields?.price[0]), // Convert to number
            quantity: Number(fields?.quantity[0]),
            category: fields?.category[0],
            shipping: fields?.shipping[0] === '1' // Convert to boolean
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
exports.list = async (req,res) => {
    let order = req.query.order ? req.query.order: 'asc'; // order into ascending or descending.
    let sortBy= req.query.sortBy ? req.query.sortBy: '_id'; // use to sort it by any parameter.
    let limit = req.query.limit ? parseInt(req.query.limit): 8; // use to limit the result.
    let skip = req.query.skip ? parseInt(req.query.skip): 0;
    try{
    const product = await Product.find().select('-photo').populate('category').sort([[sortBy, order]]).limit(limit).skip(skip)
    res.status(200).json({
        product
    })
    }
    catch(err){
        console.log(err);
        return res.status(400).json({
             error:err
        });
    }
}
// This list all the product related to that category not including that product that we are requested
exports.listRelated = async (req,res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit): 6;
     // ne->not including
    try{
        const product = await Product.find({_id: {$ne: req.product},category: req.product.category}).limit(limit).populate('category','_id name')
        return res.status(200).send(product)
    }catch(err){
       console.log(err);
       return res.status(200).json({
       error:err
       });
    }
}
exports.listCategories=async (req,res)=>{
    try{
     const product =  await Product.distinct('category',{});
     return res.status(200).json(product);
    }
    catch(err){
        console.log("helo");
        console.log(err);
        res.status(400).json({error:err});
    }
}
exports.listBySearch = async (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }
console.log(req.body);
  try{
    const product = await Product.find(findArgs).select("-photo").populate("category").sort([[sortBy,order]]).skip(skip).limit(limit)
    res.status(200).json({
        size:product.length,
        product
    })
  }catch(err){
    res.status(200).json({
        error:err
    });
  }
};
exports.photo=(req,res,next)=>{
    if(req.product.photo.data){
        res.set('Content-type',req.photo?.contentType);// we set content-type to the http header so that cleit know which data has to display so that it will adjust accordingly
        return res.status(200).send(req.product.photo.data);
    }
   next();
}
exports.listSearch =async (req,res)=>{
const { category, search } = req.query;
// Log the incoming parameters
console.log('Category:', category);
console.log('Search:', search);
try {
    // Create a query object
    let query = {};
    // If category is provided and is a valid ObjectId, add it to the query
    if (category && mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
    }
    // If search term is provided, add it to the query
    if (search) {
        query.name = { $regex: search, $options: 'i' }; // Case-insensitive search
    }
    // Perform the search
    const products = await Product.find(query).select("-photo"); // to exclude photo
    res.json(products);
}catch (error) {
    console.error(error);
    res.status(500).send('Server error');
}
}
exports.decreaseQuantity = async (req, res, next) => {
    try {
        // Prepare the bulk operations
        const bulkOps = req.body.products.map(item => {
            console.log(item);
            return {
                updateOne: {
                    filter: { _id: item._id },
                    update: {
                        $inc: { quantity: -item.count, sold: item.count } // Decrease quantity and increase sold
                    }
                }
            };
        });
        // Perform the bulk write operation using async/await
        const result = await Product.bulkWrite(bulkOps);
        console.log("resss",result);
        // Check if any documents were modified
        if (result.modifiedCount === 0) {
            return res.status(400).json({
                error: "No products were updated"
            });
        }
        // Proceed to the next middleware if successful
        next();
    } catch (error) {
        return res.status(400).json({
            error: "Could not update products"
        });
    }
};

