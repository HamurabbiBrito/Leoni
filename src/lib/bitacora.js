// lib/bitacora.js
import { pool } from './db';

export async function registrarBitacora(client, usuario, modulo, accion, detalles) {
  await client.query(
    `INSERT INTO "Bitacora" 
    (usuario_app, modulo, accion, detalles, fecha_hora)
    VALUES ($1, $2, $3, $4, NOW())`,
    [usuario || 'Sistema', modulo, accion, detalles]
  );
}