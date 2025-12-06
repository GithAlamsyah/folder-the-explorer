import { describe, it, expect } from 'bun:test';
import { FolderRepository } from '../FolderRepository';
import { TEST_FOLDER_IDS } from '../__tests__/constants/folder-ids';

describe('FolderRepository', () => {
    let repository: FolderRepository;

    // Setup before each test
    const setup = () => {
        repository = new FolderRepository();
    };

    const { DOCUMENTS, WORK, TUTORIALS, INVALID } = TEST_FOLDER_IDS;

    describe('getAll', () => {
        it('should return all folders', async () => {
            // Arrange
            setup();

            // Act
            const result = await repository.getAll();

            // Assert
            expect(result.length).toBeGreaterThan(0);
            expect(result).toBeInstanceOf(Array);
        });

        it('should return folders with correct structure', async () => {
            // Arrange
            setup();

            // Act
            const result = await repository.getAll();

            // Assert
            const folder = result[0];
            expect(folder).toHaveProperty('id');
            expect(folder).toHaveProperty('name');
            expect(folder).toHaveProperty('parentId');
            expect(folder).toHaveProperty('path');
            expect(folder).toHaveProperty('level');
        });
    });

    describe('getById', () => {
        it('should return folder when found', async () => {
            // Arrange
            setup();

            // Act
            const result = await repository.getById(DOCUMENTS);

            // Assert
            expect(result).not.toBeNull();
            expect(result?.id).toBe(DOCUMENTS);
            expect(result?.name).toBe('Documents');
        });

        it('should return null when folder not found', async () => {
            // Arrange
            setup();

            // Act
            const result = await repository.getById(INVALID);

            // Assert
            expect(result).toBeNull();
        });

        it('should return correct nested folder', async () => {
            // Arrange
            setup();

            // Act
            const result = await repository.getById(WORK);

            // Assert
            expect(result).not.toBeNull();
            expect(result?.name).toBe('Work');
            expect(result?.parentId).toBe(DOCUMENTS);
            expect(result?.level).toBe(1);
        });
    });

    describe('getChildren', () => {
        it('should return root-level folders when parentId is null', async () => {
            // Arrange
            setup();

            // Act
            const result = await repository.getChildren(null);

            // Assert
            expect(result.length).toBeGreaterThan(0);
            expect(result.every(f => f.parentId === null)).toBe(true);
            expect(result.every(f => f.level === 0)).toBe(true);
        });

        it('should return correct children for a folder', async () => {
            // Arrange
            setup();

            // Act
            const result = await repository.getChildren(DOCUMENTS); 

            // Assert
            expect(result.length).toBeGreaterThan(0);
            expect(result.every(f => f.parentId === DOCUMENTS)).toBe(true);
            expect(result.some(f => f.name === 'Work')).toBe(true);
            expect(result.some(f => f.name === 'Personal')).toBe(true);
        });

        it('should return empty array when folder has no children', async () => {
            // Arrange
            setup();

            // Act
            const result = await repository.getChildren(TUTORIALS); 

            // Assert
            expect(result).toHaveLength(0);
        });

        it('should return empty array for non-existent parent', async () => {
            // Arrange
            setup();

            // Act
            const result = await repository.getChildren(INVALID);

            // Assert
            expect(result).toHaveLength(0);
        });

        it('should maintain correct hierarchy levels', async () => {
            // Arrange
            setup();

            // Act
            const level1 = await repository.getChildren(DOCUMENTS); 
            const level2 = await repository.getChildren(WORK); 

            // Assert
            expect(level1.every(f => f.level === 1)).toBe(true);
            expect(level2.every(f => f.level === 2)).toBe(true);
        });
    });

    describe('Data Integrity', () => {
        it('should have valid parent-child relationships', async () => {
            // Arrange
            setup();

            // Act
            const allFolders = await repository.getAll();

            // Assert - Check that all non-root folders have valid parents
            const nonRootFolders = allFolders.filter(f => f.parentId !== null);
            for (const folder of nonRootFolders) {
                const parent = allFolders.find(f => f.id === folder.parentId);
                expect(parent).toBeDefined();
                expect(parent!.level).toBe(folder.level - 1);
            }
        });

        it('should have unique IDs', async () => {
            // Arrange
            setup();

            // Act
            const allFolders = await repository.getAll();

            // Assert
            const ids = allFolders.map(f => f.id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(ids.length);
        });
    });
});
