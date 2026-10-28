import mysql from 'mysql2/promise';

let pool;

export function getPool() {
  if (!pool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL is not configured');
    pool = mysql.createPool({
      uri: url,
      connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 5),
      enableKeepAlive: true,
      ssl: process.env.DB_SSL === 'false' ? undefined : { rejectUnauthorized: true },
    });
  }
  return pool;
}

export async function query(sql, params = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}
