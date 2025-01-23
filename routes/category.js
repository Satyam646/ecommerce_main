const express = require("express");
const router = express.Router();
const { requireSignin,isAuth,isAdmin } = require("../Controllers/auth");
const { create,categoryById,read } = require("../Controllers/category");  // this is used to create category
const { userById } = require("../Controllers/users");

// router.post("/category/create", create);
router.post("/category/create/:userId", requireSignin,isAuth,isAdmin,create);
router.get("/category/:categoryId",requireSignin,read)
router.param("userId",userById)
router.param("categoryId",categoryById);


module.exports = router;