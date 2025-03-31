// lib/db.js
import { Pool } from 'pg';

// PostgreSQL configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  max: 10,
  idleTimeoutMillis: 60000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

const pool = new Pool(dbConfig);

// Universal query executor (Edge and Node compatible)
export async function executeQuery(query, params = [], onlyRecordset = true) {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return onlyRecordset ? result.rows : result;
  } catch (error) {
    console.error("Database query error:", {
      query: query.substring(0, 100),
      params: params.map(p => typeof p),
      error: error.message
    });
    throw new Error("Database operation failed");
  } finally {
    client.release();
  }
}

// Connection management functions
export async function connectDB() {
  if (typeof process === 'undefined') return;
  
  try {
    await pool.connect();
    console.log("Database connection established");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  }
}

export async function closePool() {
  if (typeof process === 'undefined') return;
  
  try {
    await pool.end();
    console.log("Database connection pool closed");
  } catch (error) {
    console.error("Error closing connection pool:", error.message);
  }
}

// Node.js specific signal handling
if (typeof process !== 'undefined') {
  const shutdownHandler = async (signal) => {
    console.log(`Received ${signal}, closing database connections`);
    await closePool();
    process.exit(0);
  };

  process.on("SIGINT", shutdownHandler);
  process.on("SIGTERM", shutdownHandler);
}