// lib/db-server.js (para Node.js tradicional)
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function executeQuery(query, params = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result.rows;
  } finally {
    client.release();
  }
}

// Solo para entornos Node.js
if (typeof process !== 'undefined') {
  process.on('SIGTERM', async () => {
    await pool.end();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    await pool.end();
    process.exit(0);
  });
}