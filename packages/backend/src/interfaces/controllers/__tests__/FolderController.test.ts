import { describe, it, expect } from 'bun:test';
import { Elysia } from 'elysia';
import { folderController } from '../FolderController';

describe('FolderController API', () => {
    const app = new Elysia().use(folderController);

    describe('GET /api/v1/folders', () => {
        it('should return all folders successfully', async () => {
            // Act
            const response = await app.handle(
                new Request('http://localhost/api/v1/folders')
            );
            const data: any = await response.json();

            // Assert
            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(Array.isArray(data.data)).toBe(true);
            expect(data.data.length).toBeGreaterThan(0);
        });

        it('should return folders with correct structure', async () => {
            // Act
            const response = await app.handle(
                new Request('http://localhost/api/v1/folders')
            );
            const data: any = await response.json();

            // Assert
            const folder = data.data[0];
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
            const response = await app.handle(
                new Request('http://localhost/api/v1/folders/1')
            );
            const data: any = await response.json();

            // Assert
            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.data.id).toBe('1');
            expect(data.data.name).toBe('Documents');
        });

        it('should return 404 when folder not found', async () => {
            // Act
            const response = await app.handle(
                new Request('http://localhost/api/v1/folders/999')
            );
            const data: any = await response.json();

            // Assert
            expect(response.status).toBe(404);
            expect(data.success).toBe(false);
            expect(data.data).toBeNull();
            expect(data.message).toContain('not found');
        });

        it('should return nested folder correctly', async () => {
            // Act
            const response = await app.handle(
                new Request('http://localhost/api/v1/folders/6')
            );
            const data: any = await response.json();

            // Assert
            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.data.name).toBe('Work');
            expect(data.data.parentId).toBe('1');
        });
    });

    describe('GET /api/v1/folders/:id/children', () => {
        it('should return root-level folders when using "root"', async () => {
            // Act
            const response = await app.handle(
                new Request('http://localhost/api/v1/folders/root/children')
            );
            const data: any = await response.json();

            // Assert
            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(Array.isArray(data.data)).toBe(true);
            expect(data.data.every((f: any) => f.parentId === null)).toBe(true);
        });

        it('should return children of specific folder', async () => {
            // Act
            const response = await app.handle(
                new Request('http://localhost/api/v1/folders/1/children')
            );
            const data: any = await response.json();

            // Assert
            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(Array.isArray(data.data)).toBe(true);
            expect(data.data.every((f: any) => f.parentId === '1')).toBe(true);
            expect(data.data.some((f: any) => f.name === 'Work')).toBe(true);
        });

        it('should return empty array when folder has no children', async () => {
            // Act
            const response = await app.handle(
                new Request('http://localhost/api/v1/folders/30/children')
            );
            const data: any = await response.json();

            // Assert
            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.data).toHaveLength(0);
        });

        it('should return 404 when parent folder not found', async () => {
            // Act
            const response = await app.handle(
                new Request('http://localhost/api/v1/folders/999/children')
            );
            const data: any = await response.json();

            // Assert
            expect(response.status).toBe(404);
            expect(data.success).toBe(false);
            expect(data.message).toContain('not found');
        });
    });

    describe('API Response Format', () => {
        it('should always include success field', async () => {
            // Act
            const response = await app.handle(
                new Request('http://localhost/api/v1/folders')
            );
            const data: any = await response.json();

            // Assert
            expect(data).toHaveProperty('success');
            expect(typeof data.success).toBe('boolean');
        });

        it('should include data field', async () => {
            // Act
            const response = await app.handle(
                new Request('http://localhost/api/v1/folders')
            );
            const data: any = await response.json();

            // Assert
            expect(data).toHaveProperty('data');
        });

        it('should include message field on error', async () => {
            // Act
            const response = await app.handle(
                new Request('http://localhost/api/v1/folders/999')
            );
            const data: any = await response.json();

            // Assert
            expect(data).toHaveProperty('message');
            expect(typeof data.message).toBe('string');
        });
    });
});
