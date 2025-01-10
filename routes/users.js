
const express=require("express");
const { signup } = require("../Controllers/users");
const { userSignUpValidator } = require('../Validator/index');
const router=express.Router();
router.post("/signup", userSignUpValidator ,signup); //here first it goes to userSignupValidator and then it goes to signup to signup the user
module.exports=router;