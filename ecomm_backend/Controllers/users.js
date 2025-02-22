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