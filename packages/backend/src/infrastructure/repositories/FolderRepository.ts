import type { IFolderRepository } from '../../domain/repositories/IFolderRepository';
import type { Folder } from '../../domain/entities/Folder';
import { db } from '../database/connection';
import { folders } from '../database/schemas/folders';
import { eq, isNull } from 'drizzle-orm';

/**
 * PostgreSQL Folder Repository Implementation
 * Uses Drizzle ORM 
 * 
 * Following Interface Segregation Principle - implements only required methods
 */
export class FolderRepository implements IFolderRepository {
    /**
     * Get all folders in the system
     * @returns Promise<Folder[]> - Complete list of folders from database
     */
    async getAll(): Promise<Folder[]> {
        const result = await db.select({
            id: folders.id,
            name: folders.name,
            parentId: folders.parentId,
            path: folders.path,
            level: folders.level,
        }).from(folders);

        return result;
    }

    /**
     * Get a folder by its ID
     * @param id - Folder ID
     * @returns Promise<Folder | null> - Folder or null if not found
     */
    async getById(id: string): Promise<Folder | null> {
        const result = await db.select({
            id: folders.id,
            name: folders.name,
            parentId: folders.parentId,
            path: folders.path,
            level: folders.level,
        })
        .from(folders)
        .where(eq(folders.id, id))
        .limit(1);

        return result[0] ?? null;
    }

    /**
     * Get direct children of a folder
     * @param parentId - Parent folder ID, or null for root-level folders
     * @returns Promise<Folder[]> - Array of child folders from database
     */
    async getChildren(parentId: string | null): Promise<Folder[]> {
        const result = await db.select({
            id: folders.id,
            name: folders.name,
            parentId: folders.parentId,
            path: folders.path,
            level: folders.level,
        })
        .from(folders)
        .where(parentId === null ? isNull(folders.parentId) : eq(folders.parentId, parentId));

        return result;
    }
}
