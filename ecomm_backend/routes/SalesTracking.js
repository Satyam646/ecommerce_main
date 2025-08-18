
const express = require("express");
const router = express.Router();
const {
  getSalesSummary,
  getSalesByDay,
  getTopSellingProducts,
  getRecentOrders
} = require("../Controllers/SalesTracking");

router.get("/sales/summary", getSalesSummary);
router.get("/sales/by-day", getSalesByDay);
router.get("/sales/top-products", getTopSellingProducts);
router.get("/sales/recent-orders", getRecentOrders);

module.exports = router;