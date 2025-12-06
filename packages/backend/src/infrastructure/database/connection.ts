import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { combinedSchema } from './schemas/index';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/monorepo_db';

export const sql = postgres(connectionString);
export const db = drizzle(sql, { schema: combinedSchema });
