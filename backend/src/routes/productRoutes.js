const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Public routes
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/:id/calculate-price", productController.calculatePrice);

module.exports = router;
