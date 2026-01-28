const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

// Apply auth and admin middleware to all admin routes
router.use(authMiddleware, adminMiddleware);

// Product Management
router.post("/products", adminController.createProduct);
router.put("/products/:id", adminController.updateProduct);
router.delete("/products/:id", adminController.deleteProduct);

// Order Management
router.get("/orders", adminController.getAllOrders); // Use the fixed version
// router.get("/orders/simple", adminController.getAllOrdersSimple); // Alternative
router.put("/orders/:id/status", adminController.updateOrderStatus);

// Dashboard
router.get("/dashboard/stats", adminController.getDashboardStats);

// Test endpoint (optional)
router.get("/test-db", adminController.testDBConnection);

module.exports = router;
