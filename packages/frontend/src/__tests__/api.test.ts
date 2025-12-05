import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import FolderApiService from '../api';
import type { Folder, ApiResponse } from '../types';

// Mock fetch
global.fetch = vi.fn();

describe('FolderApiService', () => {
    let apiService: FolderApiService;

    beforeEach(() => {
        apiService = new FolderApiService('http://localhost:3000/api/v1');
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('getAllFolders', () => {
        it('should fetch all folders successfully', async () => {
            const mockFolders: Folder[] = [
                { id: '1', name: 'Documents', parentId: null, path: '/Documents', level: 0 },
                { id: '2', name: 'Pictures', parentId: null, path: '/Pictures', level: 0 },
            ];

            const mockResponse: ApiResponse<Folder[]> = {
                success: true,
                data: mockFolders,
            };

            (global.fetch as any).mockResolvedValueOnce({
                json: async () => mockResponse,
            });

            const result = await apiService.getAllFolders();

            expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/v1/folders');
            expect(result).toEqual(mockFolders);
        });

        it('should throw error when API request fails', async () => {
            const mockResponse: ApiResponse<Folder[]> = {
                success: false,
                data: [],
                message: 'Failed to fetch folders',
            };

            (global.fetch as any).mockResolvedValueOnce({
                json: async () => mockResponse,
            });

            await expect(apiService.getAllFolders()).rejects.toThrow('Failed to fetch folders');
        });
    });

    describe('getFolderById', () => {
        it('should fetch folder by id successfully', async () => {
            const mockFolder: Folder = {
                id: '1',
                name: 'Documents',
                parentId: null,
                path: '/Documents',
                level: 0,
            };

            const mockResponse: ApiResponse<Folder> = {
                success: true,
                data: mockFolder,
            };

            (global.fetch as any).mockResolvedValueOnce({
                json: async () => mockResponse,
            });

            const result = await apiService.getFolderById('1');

            expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/v1/folders/1');
            expect(result).toEqual(mockFolder);
        });

        it('should throw error when folder not found', async () => {
            const mockResponse: ApiResponse<Folder> = {
                success: false,
                data: null as any,
                message: 'Folder not found',
            };

            (global.fetch as any).mockResolvedValueOnce({
                json: async () => mockResponse,
            });

            await expect(apiService.getFolderById('999')).rejects.toThrow('Folder not found');
        });
    });

    describe('getFolderChildren', () => {
        it('should fetch children of a folder successfully', async () => {
            const mockChildren: Folder[] = [
                { id: '2', name: 'Work', parentId: '1', path: '/Documents/Work', level: 1 },
                { id: '3', name: 'Personal', parentId: '1', path: '/Documents/Personal', level: 1 },
            ];

            const mockResponse: ApiResponse<Folder[]> = {
                success: true,
                data: mockChildren,
            };

            (global.fetch as any).mockResolvedValueOnce({
                json: async () => mockResponse,
            });

            const result = await apiService.getFolderChildren('1');

            expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/v1/folders/1/children');
            expect(result).toEqual(mockChildren);
        });

        it('should use "root" for null parentId', async () => {
            const mockChildren: Folder[] = [
                { id: '1', name: 'Documents', parentId: null, path: '/Documents', level: 0 },
            ];

            const mockResponse: ApiResponse<Folder[]> = {
                success: true,
                data: mockChildren,
            };

            (global.fetch as any).mockResolvedValueOnce({
                json: async () => mockResponse,
            });

            const result = await apiService.getFolderChildren(null);

            expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/v1/folders/root/children');
            expect(result).toEqual(mockChildren);
        });

        it('should return empty array when folder has no children', async () => {
            const mockResponse: ApiResponse<Folder[]> = {
                success: true,
                data: [],
            };

            (global.fetch as any).mockResolvedValueOnce({
                json: async () => mockResponse,
            });

            const result = await apiService.getFolderChildren('5');

            expect(result).toEqual([]);
        });
    });
});
