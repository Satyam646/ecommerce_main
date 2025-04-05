const express = require("express");
const router = express.Router();
const { userById } = require("../Controllers/users");
const {generateToken,processPayment} = require("../Controllers/braintree")
const { requireSignin,isAuth} = require("../Controllers/auth");
router.get("/braintree/getToken/:userId",requireSignin,isAuth,generateToken);
router.post("/braintree/payment/:userId",requireSignin,isAuth,processPayment);
router.param("userId",userById);
module.exports=router;