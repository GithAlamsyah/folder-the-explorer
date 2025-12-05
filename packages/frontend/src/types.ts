/**
 * Folder entity matching backend structure
 * Kept for fallback API compatibility and manual type reference
 * When using Eden Treaty, types are inferred from backend
 */
export interface Folder {
    id: string;
    name: string;
    parentId: string | null;
    path: string;
    level: number;
}

/**
 * Folder Node for tree representation (Frontend-defined)
 * Extends Folder with UI-specific properties for recursive tree rendering
 * This type is intentionally kept in the frontend as it's a UI concern
 */
export interface FolderNode extends Folder {
    children: FolderNode[];
    isExpanded?: boolean;
}

/**
 * API Response wrapper
 * Used by fallback fetch API for type safety
 */
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
