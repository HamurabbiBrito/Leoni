import { Pool } from 'pg';

// Configuración de la conexión a PostgreSQL
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,       // Cambia 'server' por 'host'
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432, // Puerto de PostgreSQL (por defecto 5432)
  max: 10,                          // Máximo de conexiones en el pool
  idleTimeoutMillis: 60000,         // Tiempo de espera antes de liberar una conexión inactiva
  connectionTimeoutMillis: 2000,    // Tiempo de espera para establecer una conexión
};

// Crear un pool de conexiones
const pool = new Pool(dbConfig);

// Conectar a la base de datos
async function connectDB() {
  try {
    await pool.connect();
    console.log("✅ Conexión a la base de datos establecida correctamente");
  } catch (error) {
    console.error("❌ Error conectando a la base de datos:", error);
    throw error;
  }
}

// Cerrar la conexión al pool cuando la aplicación se apague
async function closePool() {
  try {
    await pool.end();
    console.log("✅ Conexión cerrada correctamente");
  } catch (error) {
    console.error("❌ Error cerrando la conexión:", error);
  }
}

// Ejecutar una consulta de forma genérica
async function executeQuery(query, params = [], onlyRecordset = true) {
  try {
    const client = await pool.connect();
    const result = await client.query(query, params);
    client.release(); // Liberar el cliente al pool

    return onlyRecordset ? result.rows : result;
  } catch (error) {
    console.error("❌ Error ejecutando la consulta:", error);
    throw error;
  }
}

// Manejo de señales para cerrar la conexión al salir
process.on("SIGINT", async () => {
  console.log("SIGINT recibido: cerrando conexión a la base de datos");
  await closePool();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM recibido: cerrando conexión a la base de datos");
  await closePool();
  process.exit(0);
});

export { connectDB, executeQuery, closePool };