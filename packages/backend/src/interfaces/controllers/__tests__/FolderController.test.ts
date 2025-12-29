import { describe, it, expect } from 'bun:test';
import { treaty } from '@elysiajs/eden';
import { folderController } from '../FolderController';
import { TEST_FOLDER_IDS } from '../__tests__/constants/folder-ids';
import type { IDatabaseAdapter } from '../../../infrastructure/database/IDatabaseAdapter';
import type { IFolderRepository } from '../../../domain/repositories/IFolderRepository';
import type { Folder } from '../../../domain/entities/Folder';

// Mock Implementation
class MockFolderRepository implements IFolderRepository {
    private mockFolders: Folder[] = [
        { id: TEST_FOLDER_IDS.DOCUMENTS, name: 'Documents', parentId: null, path: '/Documents', level: 0 },
        { id: TEST_FOLDER_IDS.WORK, name: 'Work', parentId: TEST_FOLDER_IDS.DOCUMENTS, path: '/Documents/Work', level: 1 },
        { id: TEST_FOLDER_IDS.TUTORIALS, name: 'Tutorials', parentId: null, path: '/Tutorials', level: 0 },
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

class MockDatabaseAdapter implements IDatabaseAdapter {
    createRepository(): IFolderRepository {
        return new MockFolderRepository();
    }
    async runMigrations(): Promise<void> {}
}

describe('FolderController API', () => {
    const app = folderController(new MockDatabaseAdapter());
    const api = treaty(app);
    const { DOCUMENTS, WORK, TUTORIALS, INVALID } = TEST_FOLDER_IDS;

    describe('GET /api/v1/folders', () => {
        it('should return all folders successfully', async () => {
            // Act
            const { data, status } = await api.api.v1.folders.get();

            // Assert
            expect(status).toBe(200);
            expect(data!.success).toBe(true);
            expect(Array.isArray(data!.data)).toBe(true);
            expect(data!.data).toBeDefined();
            expect(data!.data!.length).toBeGreaterThan(0);
        });

        it('should return folders with correct structure', async () => {
            // Act
            const { data } = await api.api.v1.folders.get();

            // Assert
            expect(data!.data).toBeDefined();
            expect(data!.data!.length).toBeGreaterThan(0);
            const folder = data!.data![0];
            expect(folder).toHaveProperty('id');
            expect(folder).toHaveProperty('name');
            expect(folder).toHaveProperty('parentId');
            expect(folder).toHaveProperty('path');
            expect(folder).toHaveProperty('level');
        });
    });

    describe('GET /api/v1/folders/:id', () => {
        it('should return specific folder when found', async () => {
            // Act
            const { data, status } = await api.api.v1.folders({ id: DOCUMENTS }).get();

            // Assert
            expect(status).toBe(200);
            expect(data!.success).toBe(true);
            expect(data!.data).toBeDefined();
            expect(data!.data!.id).toBe(DOCUMENTS);
            expect(data!.data!.name).toBe('Documents');
        });

        it('should return 404 when folder not found', async () => {
            // Act
            const { error, status } = await api.api.v1.folders({ id: INVALID }).get();

            // Assert
            expect(status).toBe(404);
            expect(error).toBeDefined();
            if (error && 'value' in error) {
                const errorValue = error.value as any;
                expect(errorValue.success).toBe(false);
                expect(errorValue.data).toBeNull();
                expect(errorValue.message).toContain('not found');
            }
        });

        it('should return nested folder correctly', async () => {
            // Act
            const { data, status } = await api.api.v1.folders({ id: WORK }).get();

            // Assert
            expect(status).toBe(200);
            expect(data!.success).toBe(true);
            expect(data!.data).toBeDefined();
            expect(data!.data!.name).toBe('Work');
            expect(data!.data!.parentId).toBe(DOCUMENTS);
        });
    });

    describe('GET /api/v1/folders/:id/children', () => {
        it('should return root-level folders when using "root"', async () => {
            // Act
            const { data, status } = await api.api.v1.folders({ id: 'root' }).children.get();

            // Assert
            expect(status).toBe(200);
            expect(data!.success).toBe(true);
            expect(Array.isArray(data!.data)).toBe(true);
            expect(data!.data).toBeDefined();
            expect(data!.data!.every((f: any) => f.parentId === null)).toBe(true);
        });

        it('should return children of specific folder', async () => {
            // Act
            const { data, status } = await api.api.v1.folders({ id: DOCUMENTS }).children.get();

            // Assert
            expect(status).toBe(200);
            expect(data!.success).toBe(true);
            expect(Array.isArray(data!.data)).toBe(true);
            expect(data!.data).toBeDefined();
            expect(data!.data!.every((f: any) => f.parentId === DOCUMENTS)).toBe(true);
            expect(data!.data!.some((f: any) => f.name === 'Work')).toBe(true);
        });

        it('should return empty array when folder has no children', async () => {
            // Act
            const { data, status } = await api.api.v1.folders({ id: TUTORIALS }).children.get();

            // Assert
            expect(status).toBe(200);
            expect(data!.success).toBe(true);
            expect(data!.data).toHaveLength(0);
        });

        it('should return 404 when parent folder not found', async () => {
            // Act
            const { error, status } = await api.api.v1.folders({ id: INVALID }).children.get();

            // Assert
            expect(status).toBe(404);
            expect(error).toBeDefined();
            if (error && 'value' in error) {
                const errorValue = error.value as any;
                expect(errorValue.success).toBe(false);
                expect(errorValue.message).toContain('not found');
            }
        });
    });

    describe('API Response Format', () => {
        it('should always include success field', async () => {
            // Act
            const { data } = await api.api.v1.folders.get();

            // Assert
            expect(data).toHaveProperty('success');
            expect(typeof data!.success).toBe('boolean');
        });

        it('should include data field', async () => {
            // Act
            const { data } = await api.api.v1.folders.get();

            // Assert
            expect(data).toHaveProperty('data');
        });

        it('should include message field on error', async () => {
            // Act
            const { error } = await api.api.v1.folders({ id: INVALID }).get();

            // Assert
            expect(error).toBeDefined();
            if (error && 'value' in error) {
                const errorValue = error.value as any;
                expect(errorValue).toHaveProperty('message');
                expect(typeof errorValue.message).toBe('string');
            }
        });
    });
});
