const db = require("../config/database");

const Product = {
  async findAll(limit = 100, offset = 0) {
    const result = await db.query(
      "SELECT * FROM products WHERE is_active = true ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset]
    );
    return result.rows;
  },

  async findById(id) {
    const result = await db.query(
      "SELECT * FROM products WHERE id = $1 AND is_active = true",
      [id]
    );
    return result.rows[0];
  },

  async create(productData) {
    const { name, description, price_10ml, price_35ml, image_url, stock } =
      productData;
    const result = await db.query(
      `INSERT INTO products (name, description, price_10ml, price_35ml, image_url, stock) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, description, price_10ml, price_35ml, image_url, stock]
    );
    return result.rows[0];
  },

  async update(id, productData) {
    const {
      name,
      description,
      price_10ml,
      price_35ml,
      image_url,
      stock,
      is_active,
    } = productData;
    const result = await db.query(
      `UPDATE products 
       SET name = $1, description = $2, price_10ml = $3, price_35ml = $4, 
           image_url = $5, stock = $6, is_active = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 
       RETURNING *`,
      [
        name,
        description,
        price_10ml,
        price_35ml,
        image_url,
        stock,
        is_active,
        id,
      ]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await db.query(
      "UPDATE products SET is_active = false WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows[0];
  },

  async count() {
    const result = await db.query(
      "SELECT COUNT(*) as count FROM products WHERE is_active = true"
    );
    return parseInt(result.rows[0].count);
  },
};

module.exports = Product;
