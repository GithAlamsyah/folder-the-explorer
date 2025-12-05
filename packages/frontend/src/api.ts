import type { Folder, ApiResponse } from './types';
import { api } from './lib/edenClient';

/**
 * API Configuration
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Eden Treaty-based API Service (Primary)
 * Uses type-safe Eden client for API calls
 */
export const edenFolderApi = {
    /**
     * Get all folders in the system
     * @returns Promise<Folder[]>
     */
    async getAllFolders(): Promise<Folder[]> {
        const { data, error } = await api.api.v1.folders.get();

        if (error) {
            console.error('Error fetching all folders:', error);
            const errorMessage = 'value' in error && error.value && typeof error.value === 'object' && 'message' in error.value
                ? String(error.value.message)
                : 'Failed to fetch folders';
            throw new Error(errorMessage);
        }

        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch folders');
        }

        return data.data as Folder[];
    },

    /**
     * Get a specific folder by ID
     * @param id - Folder ID
     * @returns Promise<Folder>
     */
    async getFolderById(id: string): Promise<Folder> {
        const { data, error } = await api.api.v1.folders({ id }).get();

        if (error) {
            console.error(`Error fetching folder ${id}:`, error);
            const errorMessage = 'value' in error && error.value && typeof error.value === 'object' && 'message' in error.value
                ? String(error.value.message)
                : 'Failed to fetch folder';
            throw new Error(errorMessage);
        }

        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch folder');
        }

        return data.data as Folder;
    },

    /**
     * Get direct children of a folder
     * @param parentId - Parent folder ID, or null for root-level folders
     * @returns Promise<Folder[]>
     */
    async getFolderChildren(parentId: string | null): Promise<Folder[]> {
        const id = parentId === null ? 'root' : parentId;
        const { data, error } = await api.api.v1.folders({ id }).children.get();

        if (error) {
            console.error(`Error fetching children of ${parentId}:`, error);
            const errorMessage = 'value' in error && error.value && typeof error.value === 'object' && 'message' in error.value
                ? String(error.value.message)
                : 'Failed to fetch folder children';
            throw new Error(errorMessage);
        }

        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch folder children');
        }

        return data.data as Folder[];
    },
};

/**
 * Fetch-based API Service (Fallback)
 * Manual fetch implementation for cases where Eden Treaty doesn't work
 */
export class FolderApiService {
    private baseUrl: string;

    constructor(baseUrl: string = `${API_BASE_URL}/api/v1`) {
        this.baseUrl = baseUrl;
    }

    /**
     * Get all folders in the system
     * @returns Promise<Folder[]>
     */
    async getAllFolders(): Promise<Folder[]> {
        try {
            const response = await fetch(`${this.baseUrl}/folders`);
            const data: ApiResponse<Folder[]> = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch folders');
            }

            return data.data;
        } catch (error) {
            console.error('Error fetching all folders:', error);
            throw error;
        }
    }

    /**
     * Get a specific folder by ID
     * @param id - Folder ID
     * @returns Promise<Folder>
     */
    async getFolderById(id: string): Promise<Folder> {
        try {
            const response = await fetch(`${this.baseUrl}/folders/${id}`);
            const data: ApiResponse<Folder> = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch folder');
            }

            return data.data;
        } catch (error) {
            console.error(`Error fetching folder ${id}:`, error);
            throw error;
        }
    }

    /**
     * Get direct children of a folder
     * @param parentId - Parent folder ID, or null for root-level folders
     * @returns Promise<Folder[]>
     */
    async getFolderChildren(parentId: string | null): Promise<Folder[]> {
        try {
            const id = parentId === null ? 'root' : parentId;
            const response = await fetch(`${this.baseUrl}/folders/${id}/children`);
            const data: ApiResponse<Folder[]> = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch folder children');
            }

            return data.data;
        } catch (error) {
            console.error(`Error fetching children of ${parentId}:`, error);
            throw error;
        }
    }
}

/**
 * API Mode configuration
 * Set to 'eden' for type-safe Eden Treaty, or 'fetch' for manual fetch fallback
 */
export type ApiMode = 'eden' | 'fetch';

const fallbackApi = new FolderApiService();

/**
 * Unified Folder API interface
 * Provides same interface regardless of underlying implementation
 */
export interface IFolderApi {
    getAllFolders(): Promise<Folder[]>;
    getFolderById(id: string): Promise<Folder>;
    getFolderChildren(parentId: string | null): Promise<Folder[]>;
}

/**
 * Create folder API instance based on mode
 * @param mode - 'eden' for type-safe client, 'fetch' for manual fallback
 * @returns IFolderApi implementation
 */
export function createFolderApi(mode: ApiMode = 'eden'): IFolderApi {
    return mode === 'eden' ? edenFolderApi : fallbackApi;
}

// Export default instance using Eden Treaty
export const folderApi = createFolderApi('eden');
export default FolderApiService;
