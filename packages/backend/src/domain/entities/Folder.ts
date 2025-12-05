/**
 * Domain Entity: Folder
 * Represents a folder in the hierarchical structure
 */
export interface Folder {
    id: string;
    name: string;
    parentId: string | null; // null for root-level folders
    path: string; // Full path like "/Documents/Work"
    level: number; // Depth level, 0 for root
}

/**
 * Folder Node for tree representation
 * Extends Folder with children for recursive tree structure
 */
export interface FolderNode extends Folder {
    children: FolderNode[];
}
