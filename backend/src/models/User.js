const db = require("../config/database");
const bcrypt = require("bcryptjs");

const User = {
  async create(email, password, isAdmin = false) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      "INSERT INTO users (email, password, is_admin) VALUES ($1, $2, $3) RETURNING id, email, is_admin, created_at",
      [email, hashedPassword, isAdmin]
    );
    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  },

  async findById(id) {
    const result = await db.query(
      "SELECT id, email, is_admin, created_at FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0];
  },

  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  },

  async createAdminUser() {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    const existingAdmin = await this.findByEmail(adminEmail);
    if (!existingAdmin) {
      await this.create(adminEmail, adminPassword, true);
      console.log("Admin user created successfully");
    }
  },
};

module.exports = User;
