const Order = require("../models/Order");
const Product = require("../models/Product");
const db = require("../config/database"); // ADD THIS IMPORT

// Product Management
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price_10ml, price_35ml, image_url, stock } =
      req.body;

    if (!name || !price_10ml || !price_35ml) {
      return res.status(400).json({ error: "Name and prices are required" });
    }

    const productData = {
      name,
      description: description || "",
      price_10ml: parseFloat(price_10ml),
      price_35ml: parseFloat(price_35ml),
      image_url: image_url || null,
      stock: parseInt(stock) || 100,
    };

    const product = await Product.create(productData);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      error: "Failed to create product",
      details: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.update(req.params.id, req.body);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      error: "Failed to update product",
      details: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.delete(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      error: "Failed to delete product",
      details: error.message,
    });
  }
};

// Order Management
exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status; // Optional filter

    // Build query with proper parameter binding
    let baseQuery = `
      SELECT o.*, 
      COALESCE(
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'size', oi.size,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'subtotal', oi.subtotal
          )
        ) FILTER (WHERE oi.id IS NOT NULL), '[]'
      ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
    `;

    let countQuery = "SELECT COUNT(*) FROM orders";
    let queryParams = [];
    let countParams = [];

    if (status) {
      baseQuery += ` WHERE o.status = $1 GROUP BY o.id ORDER BY o.created_at DESC LIMIT $2 OFFSET $3`;
      queryParams = [status, limit, offset];
      countQuery += ` WHERE status = $1`;
      countParams = [status];
    } else {
      baseQuery += ` GROUP BY o.id ORDER BY o.created_at DESC LIMIT $1 OFFSET $2`;
      queryParams = [limit, offset];
    }

    // Execute queries
    const ordersResult = await db.query(baseQuery, queryParams);

    // Get total count
    const countResult = await db.query(countQuery, countParams);
    const totalOrders = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      orders: ordersResult.rows,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_orders: totalOrders,
        has_next: page < totalPages,
        has_prev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    res.status(500).json({
      error: "Failed to fetch orders",
      details: error.message,
    });
  }
};

// Alternative simplified version using Order model
exports.getAllOrdersSimple = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status;

    // Use Order model's method if available, otherwise fallback
    let orders;
    if (Order.findAllWithFilter) {
      orders = await Order.findAllWithFilter(limit, offset, status);
    } else {
      // Fallback to basic findAll
      orders = await Order.findAll(limit, offset);
      if (status) {
        orders = orders.filter((order) => order.status === status);
      }
    }

    const totalOrders = await Order.count();
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      orders,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_orders: totalOrders,
        has_next: page < totalPages,
        has_prev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    res.status(500).json({
      error: "Failed to fetch orders",
      details: error.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      "pending",
      "approved",
      "cancelled",
      "shipped",
      "delivered",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.updateStatus(req.params.id, status);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      error: "Failed to update order status",
      details: error.message,
    });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await Order.getStats();
    const totalProducts = await Product.count();

    res.json({
      stats: {
        ...stats,
        total_products: totalProducts,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      error: "Failed to fetch dashboard stats",
      details: error.message,
    });
  }
};

// Helper function to test database connection
exports.testDBConnection = async (req, res) => {
  try {
    const result = await db.query("SELECT NOW() as server_time");
    const tables = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    res.json({
      success: true,
      server_time: result.rows[0].server_time,
      tables: tables.rows.map((t) => t.table_name),
      database_connected: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      database_connected: false,
    });
  }
};
