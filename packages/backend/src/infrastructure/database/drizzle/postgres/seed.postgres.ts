import { dbClient, drizzleClient } from './client.postgres';
import { folders } from '../schemas/folders';

import { seedFolders } from '../seeds/folders.seeds';

/**
 * Database Seeding Function
 * Populates the database with initial folder data
 * Safe to call programmatically (doesn't close connection)
 */
export async function postgresSeed(options: { force?: boolean } = {}) {
    console.log('🌱 Seeding database...');

    try {
        // Safety check - don't seed in production unless forced
        if (process.env.NODE_ENV === 'production' && !options.force) {
            console.warn('⚠️  Skipping seed in production environment');
            console.log('   Use { force: true } to override this behavior');
            return;
        }

        // Check if data already exists
        const existingFolders = await drizzleClient.select().from(folders).limit(1);

        if (existingFolders.length > 0 && !options.force) {
            console.log('ℹ️  Database already contains data. Skipping seed.');
            console.log('   Use { force: true } to clear and re-seed');
            return;
        }

        // Clear existing data if force is true
        if (options.force) {
            console.log('🧹 Clearing existing data...');
            await drizzleClient.delete(folders);
        }

        // Insert seed data
        console.log('📝 Inserting seed data...');
        await seedFolders(drizzleClient);

        console.log('✅ Database seeded successfully!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    }
}

/**
 * Standalone seeding script
 * 
 * Usage:
 *   bun db:seed              # Seeds only if database is empty
 *   bun db:seed --force      # Force re-seed (clears existing data)
 */
if (import.meta.main) {
    // Parse CLI arguments
    const args = Bun.argv.slice(2); // Remove 'bun' and script path
    const forceFlag = args.includes('--force');

    postgresSeed({ force: forceFlag })
        .then(() => {
            console.log('Seed script completed');
            dbClient.end();
        })
        .catch((err) => {
            console.error('Seed script failed:', err);
            dbClient.end();
            process.exit(1);
        });
}
