const express = require("express");
const router = express.Router();
const { requireSignin,isAuth,isAdmin } = require("../Controllers/auth");
const { userById } = require("../Controllers/users");

router.get("/secret/:userId", requireSignin,isAuth, (req,res)=>{
   res.json({
    user: req.profile
   });
});


router.param("userId", userById);
module.exports = router;