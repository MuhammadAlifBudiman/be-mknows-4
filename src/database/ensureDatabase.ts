import { logger } from "@utils/logger";

export async function ensureDatabaseExists() {
  const { Client } = require('pg');
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;
  const client = new Client({
    host: DB_HOST,
    port: DB_PORT ? Number(DB_PORT) : undefined,
    user: DB_USER,
    password: DB_PASSWORD,
    database: 'postgres',
    ssl: {
        rejectUnauthorized: false, // or true if you want strict SSL
    },
  });
  try {
    await client.connect();
    const res = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [DB_DATABASE]
    );
    if (res.rowCount === 0) {
      try {
        await client.query(`CREATE DATABASE "${DB_DATABASE}"`);
        logger.info(`Database '${DB_DATABASE}' created successfully.`);
      } catch (err: any) {
        if (err.code === '42P04' || (err.message && err.message.includes('already exists'))) {
          logger.info(`Database '${DB_DATABASE}' already exists (race condition).`);
        } else {
          throw err;
        }
      }
    } else {
      logger.info(`Database '${DB_DATABASE}' already exists.`);
    }
  } catch (err: any) {
    logger.error('Error checking/creating database: ' + err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}
