// config/database.js
const { Pool } = require("pg");
require("dotenv").config();

// Serverless connection pool optimization
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  // IMPORTANT for serverless:
  max: 5, // Reduce connections
  idleTimeoutMillis: 30000, // Close idle connections faster
  connectionTimeoutMillis: 5000,
});

// Handle connection errors
pool.on("error", (err) => {
  console.error("Unexpected database error:", err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  // Helper function for serverless
  close: () => pool.end(),
};
