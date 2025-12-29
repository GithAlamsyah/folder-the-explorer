import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { folderController } from './interfaces/controllers/FolderController';
import { registerAdapter, getAdapter } from './infrastructure/database/DatabaseAdapterRegistry';
import { PostgresAdapter } from './infrastructure/database/drizzle/postgres/adapter.postgres';

const PORT = process.env.PORT || 3000;

// Register the database adapter
registerAdapter(process.env.DB_ADAPTER || 'postgres', PostgresAdapter);

// Get the database adapter from registry
const adapter = getAdapter(process.env.DB_ADAPTER || 'postgres');

// Run migrations on application startup
await adapter.runMigrations();

const app = new Elysia()
    .use(cors())
    .get('/', () => ({
        message: 'Welcome to Monorepo Backend API',
        version: '1.0.0',
    }))
    .get('/health', () => ({
        status: 'healthy',
        timestamp: new Date().toISOString(),
    }))
    .use(folderController(adapter))
    .listen(PORT);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
