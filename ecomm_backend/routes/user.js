const express = require("express");
const router = express.Router();
const { requireSignin,isAuth,isAdmin } = require("../Controllers/auth");
const { userById ,read,update,purchaseHistory} = require("../Controllers/users");


router.get("/secret/:userId", requireSignin,isAuth, (req,res)=>{
 
   res.json({
    user: req.profile
   });
});
router.get("/orders/by/user/:userId",requireSignin,isAuth,purchaseHistory);
router.get("/user/:userId",requireSignin,isAuth,read);
router.put("/user/:userId",requireSignin,isAuth,update);
router.param("userId", userById);

module.exports = router;