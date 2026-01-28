// app.js - Full version for Vercel deployment
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// CORS Configuration for Vercel
const corsOptions = {
  origin: [
    "http://localhost:3000", // Local frontend
    "http://localhost:5173", // Vite default port
    process.env.FRONTEND_URL, // Your Vercel frontend
    "https://*.vercel.app", // All Vercel deployments
    // Add your specific domains here
    (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // For production, you can add additional checks
      if (
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin.includes(".vercel.app")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging middleware (disable in production for performance)
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.log(
      `${new Date().toISOString()} - ${req.method} ${req.originalUrl}`,
    );
  }
  next();
});

// Routes - IMPORTANT: Don't duplicate /api prefix if routes already have it
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint (crucial for Vercel)
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Perfume Store API",
    environment: process.env.NODE_ENV || "development",
    node_version: process.version,
  });
});

// Root API endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to Perfume Store API",
    version: "1.0.0",
    documentation: {
      auth: {
        login: "POST /api/auth/login",
        register: "POST /api/auth/register",
        profile: "GET /api/auth/profile",
      },
      products: {
        list: "GET /api/products",
        details: "GET /api/products/:id",
      },
      orders: {
        create: "POST /api/orders",
        details: "GET /api/orders/:id",
      },
      admin: {
        requires: "Admin authentication",
        products: "CRUD /api/admin/products",
        orders: "GET /api/admin/orders",
        stats: "GET /api/admin/dashboard/stats",
      },
    },
  });
});

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    error: "API endpoint not found",
    path: req.originalUrl,
    available_endpoints: [
      "/api/auth",
      "/api/products",
      "/api/orders",
      "/api/admin",
      "/api/health",
    ],
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", {
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Handle CORS errors
  if (err.message.includes("CORS")) {
    return res.status(403).json({
      error: "CORS Error",
      message: "Request not allowed from this origin",
      allowed_origins: corsOptions.origin,
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token" });
  }

  // Default error response
  res.status(err.status || 500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Export for Vercel serverless functions
module.exports = app;

// Local development server (only runs when not on Vercel)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  // Test database connection on startup
  const db = require("./config/database");
  db.query("SELECT NOW()")
    .then(() => console.log("✅ Database connected successfully"))
    .catch((err) => {
      console.error("❌ Database connection failed:", err.message);
      process.exit(1);
    });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
    console.log(`🔧 Health check: http://localhost:${PORT}/api/health`);

    // Log allowed CORS origins
    console.log(`🎯 Allowed CORS origins:`);
    if (Array.isArray(corsOptions.origin)) {
      corsOptions.origin.forEach((origin) => {
        if (typeof origin === "string") console.log(`   • ${origin}`);
      });
    }
  });
}
