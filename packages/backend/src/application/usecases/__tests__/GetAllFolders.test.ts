import { describe, it, expect } from 'bun:test';
import { GetAllFolders } from '../GetAllFolders';
import type { IFolderRepository } from '../../../domain/repositories/IFolderRepository';
import type { Folder } from '../../../domain/entities/Folder';

/**
 * Mock implementation of FolderRepository for testing
 */
class MockFolderRepository implements IFolderRepository {
    private mockFolders: Folder[] = [
        { id: '1', name: 'Documents', parentId: null, path: '/Documents', level: 0 },
        { id: '2', name: 'Pictures', parentId: null, path: '/Pictures', level: 0 },
        { id: '3', name: 'Work', parentId: '1', path: '/Documents/Work', level: 1 },
    ];

    async getAll(): Promise<Folder[]> {
        return this.mockFolders;
    }

    async getById(id: string): Promise<Folder | null> {
        return this.mockFolders.find(f => f.id === id) ?? null;
    }

    async getChildren(parentId: string | null): Promise<Folder[]> {
        return this.mockFolders.filter(f => f.parentId === parentId);
    }
}

describe('GetAllFolders Use Case', () => {
    it('should return all folders from repository', async () => {
        // Arrange
        const mockRepository = new MockFolderRepository();
        const useCase = new GetAllFolders(mockRepository);

        // Act
        const result = await useCase.execute();

        // Assert
        expect(result).toHaveLength(3);
        expect(result[0].name).toBe('Documents');
        expect(result[1].name).toBe('Pictures');
        expect(result[2].name).toBe('Work');
    });

    it('should return empty array when repository has no folders', async () => {
        // Arrange
        class EmptyRepository implements IFolderRepository {
            async getAll(): Promise<Folder[]> { return []; }
            async getById(id: string): Promise<Folder | null> { return null; }
            async getChildren(parentId: string | null): Promise<Folder[]> { return []; }
        }

        const emptyRepository = new EmptyRepository();
        const useCase = new GetAllFolders(emptyRepository);

        // Act
        const result = await useCase.execute();

        // Assert
        expect(result).toHaveLength(0);
    });
});
