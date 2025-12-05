import type { IFolderRepository } from '../../domain/repositories/IFolderRepository';
import type { Folder } from '../../domain/entities/Folder';

/**
 * Use Case: Get All Folders
 * Retrieves all folders in the system for building the complete tree structure
 * 
 * Following Single Responsibility Principle - handles only folder retrieval
 */
export class GetAllFolders {
    constructor(private folderRepository: IFolderRepository) { }

    /**
     * Execute the use case
     * @returns Promise<Folder[]> - Array of all folders
     */
    async execute(): Promise<Folder[]> {
        return await this.folderRepository.getAll();
    }
}
