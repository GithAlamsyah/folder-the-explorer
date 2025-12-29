import { defineConfig } from 'drizzle-kit';

const getDatabaseConfig = () => {
    switch (process.env.DATABASE_ENGINE) {
        case "postgres":
            return {
                dialect: 'postgresql' as const,
                dbCredentials: {
                    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/monorepo_db',
                },
            }
        default:
            throw new Error("Unsupoorted Database Engine")
    }
}


export default defineConfig({
    schema: './src/infrastructure/database/schemas/**/*.ts',
    out: './drizzle',
    ...getDatabaseConfig(),
});
