import type { Folder } from '../entities/Folder';

/**
 * Repository Interface for Folder operations
 * Following the Dependency Inversion Principle
 */
export interface IFolderRepository {
    /**
     * Get all folders in the system (flattened list)
     * Useful for building the complete tree structure
     */
    getAll(): Promise<Folder[]>;

    /**
     * Get a single folder by its ID
     * @param id - Folder ID
     * @returns Folder or null if not found
     */
    getById(id: string): Promise<Folder | null>;

    /**
     * Get direct children of a folder
     * @param parentId - Parent folder ID, or null for root-level folders
     * @returns Array of child folders
     */
    getChildren(parentId: string | null): Promise<Folder[]>;
}
