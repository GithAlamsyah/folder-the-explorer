import type { IFolderRepository } from '../../domain/repositories/IFolderRepository';
import type { Folder } from '../../domain/entities/Folder';

/**
 * In-Memory Folder Repository Implementation
 * Contains mock hierarchical folder structure for demonstration
 * 
 * Following Interface Segregation Principle - implements only required methods
 */
export class FolderRepository implements IFolderRepository {
    /**
     * Mock folder data with hierarchical structure
     * Simulates a realistic folder system with multiple levels
     */
    private folders: Folder[] = [
        // Root level folders (level 0)
        { id: '1', name: 'Documents', parentId: null, path: '/Documents', level: 0 },
        { id: '2', name: 'Pictures', parentId: null, path: '/Pictures', level: 0 },
        { id: '3', name: 'Downloads', parentId: null, path: '/Downloads', level: 0 },
        { id: '4', name: 'Music', parentId: null, path: '/Music', level: 0 },
        { id: '5', name: 'Videos', parentId: null, path: '/Videos', level: 0 },

        // Documents subfolders (level 1)
        { id: '6', name: 'Work', parentId: '1', path: '/Documents/Work', level: 1 },
        { id: '7', name: 'Personal', parentId: '1', path: '/Documents/Personal', level: 1 },
        { id: '8', name: 'Projects', parentId: '1', path: '/Documents/Projects', level: 1 },

        // Work subfolders (level 2)
        { id: '9', name: 'Reports', parentId: '6', path: '/Documents/Work/Reports', level: 2 },
        { id: '10', name: 'Presentations', parentId: '6', path: '/Documents/Work/Presentations', level: 2 },
        { id: '11', name: 'Contracts', parentId: '6', path: '/Documents/Work/Contracts', level: 2 },

        // Projects subfolders (level 2)
        { id: '12', name: 'Web Development', parentId: '8', path: '/Documents/Projects/Web Development', level: 2 },
        { id: '13', name: 'Mobile Apps', parentId: '8', path: '/Documents/Projects/Mobile Apps', level: 2 },
        { id: '14', name: 'Data Science', parentId: '8', path: '/Documents/Projects/Data Science', level: 2 },

        // Web Development subfolders (level 3)
        { id: '15', name: 'Frontend', parentId: '12', path: '/Documents/Projects/Web Development/Frontend', level: 3 },
        { id: '16', name: 'Backend', parentId: '12', path: '/Documents/Projects/Web Development/Backend', level: 3 },
        { id: '17', name: 'Full Stack', parentId: '12', path: '/Documents/Projects/Web Development/Full Stack', level: 3 },

        // Pictures subfolders (level 1)
        { id: '18', name: 'Vacation', parentId: '2', path: '/Pictures/Vacation', level: 1 },
        { id: '19', name: 'Family', parentId: '2', path: '/Pictures/Family', level: 1 },
        { id: '20', name: 'Screenshots', parentId: '2', path: '/Pictures/Screenshots', level: 1 },

        // Vacation subfolders (level 2)
        { id: '21', name: '2024', parentId: '18', path: '/Pictures/Vacation/2024', level: 2 },
        { id: '22', name: '2023', parentId: '18', path: '/Pictures/Vacation/2023', level: 2 },

        // Downloads subfolders (level 1)
        { id: '23', name: 'Software', parentId: '3', path: '/Downloads/Software', level: 1 },
        { id: '24', name: 'Documents', parentId: '3', path: '/Downloads/Documents', level: 1 },
        { id: '25', name: 'Media', parentId: '3', path: '/Downloads/Media', level: 1 },

        // Music subfolders (level 1)
        { id: '26', name: 'Rock', parentId: '4', path: '/Music/Rock', level: 1 },
        { id: '27', name: 'Jazz', parentId: '4', path: '/Music/Jazz', level: 1 },
        { id: '28', name: 'Classical', parentId: '4', path: '/Music/Classical', level: 1 },

        // Videos subfolders (level 1)
        { id: '29', name: 'Movies', parentId: '5', path: '/Videos/Movies', level: 1 },
        { id: '30', name: 'Tutorials', parentId: '5', path: '/Videos/Tutorials', level: 1 },
    ];

    /**
     * Get all folders in the system
     * @returns Promise<Folder[]> - Complete list of folders
     */
    async getAll(): Promise<Folder[]> {
        // Simulate async operation
        return Promise.resolve([...this.folders]);
    }

    /**
     * Get a folder by its ID
     * @param id - Folder ID
     * @returns Promise<Folder | null> - Folder or null if not found
     */
    async getById(id: string): Promise<Folder | null> {
        const folder = this.folders.find(f => f.id === id);
        return Promise.resolve(folder ?? null);
    }

    /**
     * Get direct children of a folder
     * @param parentId - Parent folder ID, or null for root-level folders
     * @returns Promise<Folder[]> - Array of child folders
     */
    async getChildren(parentId: string | null): Promise<Folder[]> {
        const children = this.folders.filter(f => f.parentId === parentId);
        return Promise.resolve([...children]);
    }
}
