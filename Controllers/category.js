const Category = require("../Models/category");
const { findById } = require("../Models/product");

exports.categoryById =  async (req,res,next,id) =>{
    try{
        let category=await Category.findById(id);
        // console.log(category);
        if(!category){
              return res.status(400).json({
                error:"Category not found"
              })
        }
        req.category=category;
        next();
    }catch(err){
        console.log(err);
        res.status(400).send(err);
    }
}
exports.create = async (req,res) => {
    try{
    const category = new Category(req.body);
    const savedCategory = await category.save();
    res.status(200).send(savedCategory); //If key and value are same then we have to do this.
    } catch(error){
        res.status(500).send({error});
    }
    // try{
    //     const user = new User(req.body);
    //     const savedUser = await user.save(); // Use await to handle the promise
    //     savedUser.hashed_password=undefined; // not need we to enter this use virtual password there
    //     savedUser.salt=undefined;
    //     res.status(201).send(savedUser);
    //     } catch (error) {
    //         // error
    //     res.status(500).send(error.errorResponse);
    //     }
}
exports.update=async (req,res)=>{
    const category=req.category;
    category.name=req.body.name;
    try{
        const updatedCategory = await category.save();
        res.status(200).json({updatedCategory});
    }catch(err){
        console.log(err);
        res.status(400).json({
            error:err
        })
    }
}
exports.remove= async (req,res) =>{
    try{
       const category=req.category;
       const result = await category.deleteOne(category)
       return res.status(200).json({
        message:"Category deleted successfully"
       })
    }catch(err){
        error:err
    }
}
exports.list= async (req,res) =>{
    try{       
        const category=await Category.find();
         res.status(200).json({
            category:category
         })
    }catch(err){
        error:err
    }
}

exports.read = (req,res) =>{
    res.status(200).json(req.category);

}