import { describe, it, expect } from 'bun:test';
import { GetFolderById } from '../GetFolderById';
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

describe('GetFolderById Use Case', () => {
    it('should return folder when found by id', async () => {
        // Arrange
        const mockRepository = new MockFolderRepository();
        const useCase = new GetFolderById(mockRepository);

        // Act
        const result = await useCase.execute('1');

        // Assert
        expect(result).not.toBeNull();
        expect(result?.id).toBe('1');
        expect(result?.name).toBe('Documents');
        expect(result?.path).toBe('/Documents');
    });

    it('should return null when folder not found', async () => {
        // Arrange
        const mockRepository = new MockFolderRepository();
        const useCase = new GetFolderById(mockRepository);

        // Act
        const result = await useCase.execute('999');

        // Assert
        expect(result).toBeNull();
    });

    it('should return correct folder for nested item', async () => {
        // Arrange
        const mockRepository = new MockFolderRepository();
        const useCase = new GetFolderById(mockRepository);

        // Act
        const result = await useCase.execute('3');

        // Assert
        expect(result).not.toBeNull();
        expect(result?.id).toBe('3');
        expect(result?.name).toBe('Work');
        expect(result?.parentId).toBe('1');
        expect(result?.level).toBe(1);
    });
});
