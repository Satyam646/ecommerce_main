    const User = require('../Models/users');
    exports.signup=async (req,res)=>{
        console.log("req.body",  req.body);
        try{
        const user = new User(req.body);
        const savedUser = await user.save(); // Use await to handle the promise
        savedUser.hashed_password=undefined;
        savedUser.salt=undefined;
        res.status(201).send(savedUser);
        } catch (error) {
            // error
        res.status(500).send(error.errorResponse);
        }
        };
    // user.save((err,res)=>{
    //     if(err){
           
    //     }
    //     res.json({
    //           user
    //     });
    // });
    // this save method is use to save our request body to our database.

