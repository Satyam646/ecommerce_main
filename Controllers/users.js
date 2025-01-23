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