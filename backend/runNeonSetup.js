// runNeonSetup.js
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();

async function setupDatabase() {
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, "neon-setup.sql");
    const sqlContent = fs.readFileSync(sqlPath, "utf8");

    // Create a new pool connection
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    console.log("🚀 Setting up Neon database...");

    // Split SQL into individual statements and execute
    const statements = sqlContent
      .split(";")
      .filter((stmt) => stmt.trim() !== "");

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await pool.query(statement);
          console.log(
            "✓ Executed:",
            statement.split("\n")[0].substring(0, 50) + "...",
          );
        } catch (err) {
          // Ignore "already exists" errors for idempotency
          if (!err.message.includes("already exists")) {
            console.warn("⚠ Warning:", err.message);
          }
        }
      }
    }

    console.log("✅ Database setup completed!");

    // Verify tables were created
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    console.log("\n📊 Created tables:");
    result.rows.forEach((row) => {
      console.log(`   • ${row.table_name}`);
    });

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error setting up database:", error.message);
    process.exit(1);
  }
}

setupDatabase();
