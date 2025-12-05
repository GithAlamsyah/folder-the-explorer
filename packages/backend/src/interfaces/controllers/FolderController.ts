import { Elysia, t } from 'elysia';
import { GetAllFolders } from '../../application/usecases/GetAllFolders';
import { GetFolderById } from '../../application/usecases/GetFolderById';
import { GetFolderChildren } from '../../application/usecases/GetFolderChildren';
import { FolderRepository } from '../../infrastructure/repositories/FolderRepository';

/**
 * Folder Controller
 * RESTful API endpoints for folder operations
 * Following REST API standards with versioning (v1)
 */

// Initialize dependencies (Dependency Injection)
const folderRepository = new FolderRepository();
const getAllFolders = new GetAllFolders(folderRepository);
const getFolderById = new GetFolderById(folderRepository);
const getFolderChildren = new GetFolderChildren(folderRepository);

/**
 * Folder API Routes
 * Base path: /api/v1/folders
 * 
 * Following REST conventions:
 * - GET for retrieval operations
 * - Proper HTTP status codes
 * - Consistent response format
 */
export const folderController = new Elysia({ prefix: '/api/v1/folders' })
    /**
     * GET /api/v1/folders
     * Get all folders in the system (for building tree structure)
     */
    .get('/', async () => {
        try {
            const folders = await getAllFolders.execute();
            return {
                success: true,
                data: folders,
            };
        } catch (error) {
            return {
                success: false,
                data: null,
                message: error instanceof Error ? error.message : 'Failed to retrieve folders',
            };
        }
    })

    /**
     * GET /api/v1/folders/:id
     * Get a specific folder by ID
     */
    .get('/:id', async ({ params, set }) => {
        try {
            const folder = await getFolderById.execute(params.id);

            if (!folder) {
                set.status = 404;
                return {
                    success: false,
                    data: null,
                    message: `Folder with id ${params.id} not found`,
                };
            }

            return {
                success: true,
                data: folder,
            };
        } catch (error) {
            set.status = 500;
            return {
                success: false,
                data: null,
                message: error instanceof Error ? error.message : 'Failed to retrieve folder',
            };
        }
    }, {
        params: t.Object({
            id: t.String({ minLength: 1 }),
        }),
    })

    /**
     * GET /api/v1/folders/:id/children
     * Get direct children of a folder
     * Special case: use 'root' as id to get root-level folders
     */
    .get('/:id/children', async ({ params, set }) => {
        try {
            // Handle special 'root' case for top-level folders
            const parentId = params.id === 'root' ? null : params.id;

            // If not root, verify parent folder exists
            if (parentId !== null) {
                const parentFolder = await getFolderById.execute(parentId);
                if (!parentFolder) {
                    set.status = 404;
                    return {
                        success: false,
                        data: null,
                        message: `Parent folder with id ${parentId} not found`,
                    };
                }
            }

            const children = await getFolderChildren.execute(parentId);

            return {
                success: true,
                data: children,
            };
        } catch (error) {
            set.status = 500;
            return {
                success: false,
                data: null,
                message: error instanceof Error ? error.message : 'Failed to retrieve folder children',
            };
        }
    }, {
        params: t.Object({
            id: t.String({ minLength: 1 }),
        }),
    });
