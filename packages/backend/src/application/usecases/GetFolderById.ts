import type { IFolderRepository } from '../../domain/repositories/IFolderRepository';
import type { Folder } from '../../domain/entities/Folder';

/**
 * Use Case: Get Folder By ID
 * Retrieves a specific folder by its unique identifier
 * 
 * Following Single Responsibility Principle - handles only single folder retrieval
 */
export class GetFolderById {
    constructor(private folderRepository: IFolderRepository) { }

    /**
     * Execute the use case
     * @param id - Folder ID
     * @returns Promise<Folder | null> - Folder or null if not found
     */
    async execute(id: string): Promise<Folder | null> {
        return await this.folderRepository.getById(id);
    }
}
