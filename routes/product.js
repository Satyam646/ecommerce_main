// const express = require("express");
// const router = express.Router();


// const { requireSignin,isAuth,isAdmin} = require("../Controllers/auth")
// const { create } = require("../Controllers/product");
// const { userById } = require("../Controllers/users");

// router.post("product/create/:userId",requireSignin,isAuth,isAdmin,create);

// router.param("userId", userById);

// module.exports = router;
const express = require("express");
const router = express.Router();
const { requireSignin,isAuth,isAdmin } = require("../Controllers/auth");
const { create,productById,read,remove} = require("../Controllers/product");  // this is used to create category
const { userById } = require("../Controllers/users");
const { update } = require("../Controllers/product")
router.get("/product/:productId",read);
// router.post("/category/create", create);
router.post("/product/create/:userId", requireSignin,isAuth,isAdmin,create);
router.delete("/product/delete/:userId/:productId",requireSignin,isAuth,isAdmin,remove);
router.put("/product/update/:userId/:productId",requireSignin,isAuth,isAdmin,update);
router.param("productId",productById);
router.param("userId",userById)


module.exports = router;

