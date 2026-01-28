const Product = require("../models/Product");

exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const products = await Product.findAll(limit, offset);
    const totalProducts = await Product.count();
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      products,
      pagination: {
        current_page: page,
        total_pages: totalPages,
        total_products: totalProducts,
        has_next: page < totalPages,
        has_prev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Calculate prices for different sizes
    const prices = {
      "10ml": product.price_10ml,
      "35ml": product.price_35ml,
    };

    res.json({
      ...product,
      prices,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// FIX THIS FUNCTION in productController.js
exports.calculatePrice = async (req, res) => {
  try {
    const { size, quantity = 1 } = req.body;
    const productId = req.params.id;

    // Actually fetch the product from database
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const price = size === "10ml" ? product.price_10ml : product.price_35ml;
    const total = price * quantity;

    res.json({
      size,
      unit_price: price,
      quantity,
      total_price: total,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
