const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "budget_db",
  password: process.env.DB_PASSWORD || "yourpassword",
  port: process.env.DB_PORT || 5432,
});

pool.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("PostgreSQL connected:");
  }
});

module.exports = pool;
