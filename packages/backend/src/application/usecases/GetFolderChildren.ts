import type { IFolderRepository } from '../../domain/repositories/IFolderRepository';
import type { Folder } from '../../domain/entities/Folder';

/**
 * Use Case: Get Folder Children
 * Retrieves direct children of a specified folder
 * 
 * Following Single Responsibility Principle - handles only children retrieval
 */
export class GetFolderChildren {
    constructor(private folderRepository: IFolderRepository) { }

    /**
     * Execute the use case
     * @param parentId - Parent folder ID, or null for root-level folders
     * @returns Promise<Folder[]> - Array of child folders
     */
    async execute(parentId: string | null): Promise<Folder[]> {
        if (parentId !== null) {
            const parent = await this.folderRepository.getById(parentId);
            if (!parent) {
                throw new Error('Parent folder not found');
            }
        }
        return await this.folderRepository.getChildren(parentId);
    }
}
