const express = require("express");
const router = express.Router();
const { requireSignin,isAuth,isAdmin } = require("../Controllers/auth");
const { create,categoryById,read,update,remove,list} = require("../Controllers/category");  // this is used to create category
const { userById } = require("../Controllers/users");

// router.post("/category/create", create);
router.post("/category/create/:userId", requireSignin,isAuth,isAdmin,create);
router.get("/category/:categoryId",requireSignin,read)
router.delete("/category/remove/:categoryId",requireSignin,remove)
router.put("/category/update/:categoryId",requireSignin,update)
router.get("/category",list);
router.param("userId",userById)
router.param("categoryId",categoryById);


module.exports = router;