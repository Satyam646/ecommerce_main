const express=require("express");
const { signin, requireSignin } = require("../Controllers/auth");
const { signout }  = require("../Controllers/auth");
const { signup, googleLogin} = require("../Controllers/auth");
const { userSignUpValidator } = require('../Validator/index');
const router=express.Router();
router.post("/signin", signin);
router.post("/signup", userSignUpValidator ,signup); //here first it goes to userSignupValidator and then it goes to signup to signup the user
router.get("/signout", signout);
router.get("/hello",(req,res)=>{ res.json("hello world") });// require signin is a middle ware
router.post("/api/google-login",googleLogin);
module.exports=router;