const db = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const Order = {
  async create(orderData, items) {
    const client = await db.pool.connect();

    try {
      await client.query("BEGIN");

      const orderNumber = `ORD-${uuidv4().split("-")[0].toUpperCase()}`;

      // Create order
      const orderResult = await client.query(
        `INSERT INTO orders (
          order_number, customer_name, age, school, address, 
          email, phone_number, total_amount, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING *`,
        [
          orderNumber,
          orderData.customer_name,
          orderData.age,
          orderData.school,
          orderData.address,
          orderData.email,
          orderData.phone_number,
          orderData.total_amount,
          orderData.notes || null,
        ],
      );

      const order = orderResult.rows[0];

      // Create order items
      for (const item of items) {
        await client.query(
          `INSERT INTO order_items (
            order_id, product_id, size, quantity, unit_price, subtotal
          ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            order.id,
            item.product_id,
            item.size,
            item.quantity,
            item.unit_price,
            item.subtotal,
          ],
        );
      }

      await client.query("COMMIT");
      return order;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async findAll(limit = 100, offset = 0) {
    const result = await db.query(
      `SELECT o.*, 
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
       GROUP BY o.id
       ORDER BY o.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    return result.rows;
  },

  async findById(id) {
    const result = await db.query(
      `SELECT o.*, 
       COALESCE(
         json_agg(
           json_build_object(
             'id', oi.id,
             'product_id', oi.product_id,
             'product_name', p.name,
             'size', oi.size,
             'quantity', oi.quantity,
             'unit_price', oi.unit_price,
             'subtotal', oi.subtotal,
             'image_url', p.image_url
           )
         ) FILTER (WHERE oi.id IS NOT NULL), '[]'
       ) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.id = $1
       GROUP BY o.id`,
      [id],
    );
    return result.rows[0];
  },

  async updateStatus(id, status) {
    const result = await db.query(
      `UPDATE orders 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 
       RETURNING *`,
      [status, id],
    );
    return result.rows[0];
  },

  async count() {
    const result = await db.query("SELECT COUNT(*) as count FROM orders");
    return parseInt(result.rows[0].count);
  },

  async getStats() {
    const result = await db.query(`
      SELECT 
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_orders,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue
      FROM orders
    `);
    return result.rows[0];
  },

  // In Order.js, add this method to the Order object
  async findAllWithFilter(limit = 100, offset = 0, status = null) {
    let query = `
    SELECT o.*, 
    COALESCE(
      json_agg(
        json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'product_name', p.name,
          'size', oi.size,
          'quantity', oi.quantity,
          'unit_price', oi.unit_price,
          'subtotal', oi.subtotal,
          'image_url', p.image_url
        )
      ) FILTER (WHERE oi.id IS NOT NULL), '[]'
    ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
  `;

    let params = [limit, offset];

    if (status) {
      query += ` WHERE o.status = $3 GROUP BY o.id ORDER BY o.created_at DESC LIMIT $1 OFFSET $2`;
      params.push(status);
    } else {
      query += ` GROUP BY o.id ORDER BY o.created_at DESC LIMIT $1 OFFSET $2`;
    }

    const result = await db.query(query, params);
    return result.rows;
  },
};

module.exports = Order;
