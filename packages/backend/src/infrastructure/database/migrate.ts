import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db, sql } from './connection';
import path from 'path';

/**
 * Run database migrations
 * This function can be safely called on application startup
 * without closing the database connection
 */
export async function runMigrations() {
    try {
        console.log('🔄 Running database migrations...');
        
        // Use path.join to construct absolute path to migrations folder
        // drizzle-orm expects the folder containing meta/ and *.sql files
        // Handle both monorepo root and package-level CWD   
        const cwd = process.cwd();
        const migrationsPath = cwd.endsWith('packages/backend') 
            ? path.join(cwd, 'drizzle')
            : path.join(cwd, 'packages', 'backend', 'drizzle');
        
        console.log('📁 Migrations path:', migrationsPath);
        await migrate(db, { migrationsFolder: migrationsPath });
        
        console.log('✅ Migrations completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
}

/**
 * Standalone migration script
 * Run with: bun src/infrastructure/database/migrate.ts
 */
if (import.meta.main) {
    runMigrations()
        .then(() => {
            console.log('Migration script completed');
            sql.end();
        })
        .catch((err) => {
            console.error('Migration script failed!', err);
            sql.end();
            process.exit(1);
        });
}
