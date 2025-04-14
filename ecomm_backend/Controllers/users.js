const { Order } = require("../Models/order");
const User = require("../Models/users");


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
exports.read = (req,res) => {
   
      req.profile.hashed_password=undefined;
      req.profile.salt=undefined;
      return res.status(200).json(
        req.profile
      )    
     
}

exports.update = async (req,res) => {
    try{
const user = await User.findOneAndUpdate(
    {_id:req.profile._id},
    {$set: req.body}, //this will be replaced
    {new:true}
  
);
return res.json(user);
    }catch(err){
        return res.ststus(400).json(err);
    }
}
exports.addOrderToUserHistory = async (req,res,next) =>{
    try {
    const history = [];
    console.log(req.body);
    req.body.products.forEach((item)=>{
        history.push({
          _id:item._id,
          name:item.name,
          description:item.description,
          category:item.category,
          quantity:item.count,
          transaction_id:req.body.transaction_id,
          amount:req.body.amount,
        })
    })
    // User.findOneAndUpdate(
    //     {_id:req.profile._id},
    //     {$push:{history:history}},
    //     {new:true}, // it ensures that updated user history is returned
    //     (error,data) =>{
    //     if(error){
    //         return res.status(400).json({
    //             error:"could not update userPurchase history",
    //         })
    //     }
    //     next();
    //     }
      
    // )
    const updatedUser = await User.findOneAndUpdate(
        { _id: req.profile._id },
        { $push: { history: history } },
        { new: true } // Ensures the updated document is returned
    );

    if (!updatedUser) {
        return res.status(400).json({
            error: "User not found",
        });
    }

    next(); // Pass control to the next middleware
   }catch(error) {
    return res.status(400).json({
        error: "Could not update user purchase history",
    });
   }

}
exports.purchaseHistory = async (req,res)=>{
    console.log(req);
      try{
         const history= await Order.find({user:req.profile._id}).populate('user','_id name').sort('-created').exec(); //-depicts decending order;
         res.status(200).json(history);
         console.log(history)
      }catch(error){
        res.status(400).json(error);
      }
}
