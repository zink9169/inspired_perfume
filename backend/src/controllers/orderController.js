const Order = require("../models/Order");
const Product = require("../models/Product");

exports.createOrder = async (req, res) => {
  try {
    const {
      customer_name,
      age,
      school,
      address,
      email,
      phone_number,
      items,
      notes,
    } = req.body;

    // Validate required fields
    if (
      !customer_name ||
      !age ||
      !address ||
      !phone_number ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate items and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res
          .status(400)
          .json({ error: `Product with ID ${item.product_id} not found` });
      }

      const unitPrice =
        item.size === "10ml" ? product.price_10ml : product.price_35ml;
      const subtotal = unitPrice * item.quantity;

      orderItems.push({
        product_id: item.product_id,
        size: item.size,
        quantity: item.quantity,
        unit_price: unitPrice,
        subtotal: subtotal,
      });

      totalAmount += subtotal;
    }

    const orderData = {
      customer_name,
      age: parseInt(age),
      school,
      address,
      email: email || null,
      phone_number,
      total_amount: totalAmount,
      notes: notes || null,
    };

    const order = await Order.create(orderData, orderItems);

    res.status(201).json({
      message: "Order created successfully",
      order: {
        id: order.id,
        order_number: order.order_number,
        customer_name: order.customer_name,
        total_amount: order.total_amount,
        status: order.status,
        created_at: order.created_at,
      },
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Middleware to validate order data
exports.validateOrder = (req, res, next) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ error: "Order must contain at least one item" });
  }

  for (const item of items) {
    if (!item.product_id || !item.size || !item.quantity) {
      return res
        .status(400)
        .json({ error: "Each item must have product_id, size, and quantity" });
    }

    if (!["10ml", "35ml"].includes(item.size)) {
      return res
        .status(400)
        .json({ error: 'Size must be either "10ml" or "35ml"' });
    }

    if (item.quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }
  }

  next();
};
