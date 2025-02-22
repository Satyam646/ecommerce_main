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
const { create,productById,read,remove,list,listRelated,listCategories, listBySearch,photo} = require("../Controllers/product");  // this is used to create category
const { userById } = require("../Controllers/users");
const { update } = require("../Controllers/product")
const { listSearch } = require("../Controllers/product")

router.get("/product",list); //list all the product.
router.get("/product/:productId",read);
// router.post("/category/create", create);
router.post("/product/create/:userId", requireSignin,isAuth,isAdmin,create);
router.get("/searchBY",listSearch);
router.delete("/product/delete/:userId/:productId",requireSignin,isAuth,isAdmin,remove);
router.put("/product/update/:userId/:productId",requireSignin,isAuth,isAdmin,update);
router.get("/product/related/:productId",listRelated);
router.get("/productCategories",listCategories);
router.post("/product/by/search",listBySearch);
router.get('/product/photo/:productId',photo)
router.param("productId",productById);
router.param("userId",userById);


module.exports = router;

