import { describe, it, expect } from 'bun:test';
import { GetFolderChildren } from '../GetFolderChildren';
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
        { id: '4', name: 'Personal', parentId: '1', path: '/Documents/Personal', level: 1 },
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

describe('GetFolderChildren Use Case', () => {
    it('should return root-level folders when parentId is null', async () => {
        // Arrange
        const mockRepository = new MockFolderRepository();
        const useCase = new GetFolderChildren(mockRepository);

        // Act
        const result = await useCase.execute(null);

        // Assert
        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Documents');
        expect(result[1].name).toBe('Pictures');
        expect(result.every(f => f.parentId === null)).toBe(true);
    });

    it('should return children of a specific folder', async () => {
        // Arrange
        const mockRepository = new MockFolderRepository();
        const useCase = new GetFolderChildren(mockRepository);

        // Act
        const result = await useCase.execute('1');

        // Assert
        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Work');
        expect(result[1].name).toBe('Personal');
        expect(result.every(f => f.parentId === '1')).toBe(true);
    });

    it('should return empty array when folder has no children', async () => {
        // Arrange
        const mockRepository = new MockFolderRepository();
        const useCase = new GetFolderChildren(mockRepository);

        // Act
        const result = await useCase.execute('2'); // Pictures has no children

        // Assert
        expect(result).toHaveLength(0);
    });

    it('should throw error when parent folder does not exist', async () => {
        // Arrange
        const mockRepository = new MockFolderRepository();
        const useCase = new GetFolderChildren(mockRepository);

        // Act & Assert
        try {
            await useCase.execute('999');
            // Fail if no error is thrown
            expect(true).toBe(false);
        } catch (error) {
            expect(error instanceof Error).toBe(true);
            expect((error as Error).message).toBe('Parent folder not found');
        }
    });
});
