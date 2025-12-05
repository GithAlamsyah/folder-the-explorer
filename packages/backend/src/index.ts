import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { folderController } from './interfaces/controllers/FolderController';

const PORT = process.env.PORT || 3000;

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
    .use(folderController)
    .listen(PORT);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
