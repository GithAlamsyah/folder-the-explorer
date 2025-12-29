import { pgTable, uuid, varchar, timestamp, text, integer, type PgColumn } from 'drizzle-orm/pg-core';

export const folders = pgTable('folders', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    parentId: uuid('parent_id').references((): PgColumn => folders.id, { onDelete: 'cascade' }),
    path: text('path').notNull(),
    level: integer('level').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
