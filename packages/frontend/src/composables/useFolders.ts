import { ref, onMounted } from 'vue';
import type { Folder, FolderNode } from '../types';
import folderApi from '../api';

/**
 * Composable for folder state management
 * Handles folder data fetching, tree building, and selection
 */
export function useFolders() {
    const folders = ref<Folder[]>([]);
    const folderTree = ref<FolderNode[]>([]);
    const selectedFolder = ref<Folder | null>(null);
    const childrenFolders = ref<Folder[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    /**
     * Build tree structure from flat folder array
     * @param flatFolders - Flat array of folders
     * @returns Tree structure of folders
     */
    const buildTree = (flatFolders: Folder[]): FolderNode[] => {
        const folderMap = new Map<string, FolderNode>();
        const rootFolders: FolderNode[] = [];

        // Create folder nodes with children array
        flatFolders.forEach(folder => {
            folderMap.set(folder.id, {
                ...folder,
                children: [],
                isExpanded: false,
            });
        });

        // Build parent-child relationships
        flatFolders.forEach(folder => {
            const node = folderMap.get(folder.id)!;

            if (folder.parentId === null) {
                // Root folder
                rootFolders.push(node);
            } else {
                // Child folder - add to parent's children
                const parent = folderMap.get(folder.parentId);
                if (parent) {
                    parent.children.push(node);
                }
            }
        });

        return rootFolders;
    };

    /**
     * Load all folders from API
     */
    const loadFolders = async () => {
        loading.value = true;
        error.value = null;

        try {
            const data = await folderApi.getAllFolders();
            folders.value = data;
            folderTree.value = buildTree(data);
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to load folders';
            console.error('Error loading folders:', err);
        } finally {
            loading.value = false;
        }
    };

    /**
     * Select a folder and load its children
     * @param folder - Selected folder
     */
    const selectFolder = async (folder: Folder) => {
        selectedFolder.value = folder;
        loading.value = true;
        error.value = null;

        try {
            const children = await folderApi.getFolderChildren(folder.id);
            childrenFolders.value = children;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to load children';
            console.error('Error loading folder children:', err);
            childrenFolders.value = [];
        } finally {
            loading.value = false;
        }
    };

    /**
     * Toggle folder expansion in tree
     * @param folderId - ID of folder to toggle
     */
    const toggleExpansion = (node: FolderNode) => {
        node.isExpanded = !node.isExpanded;
    };

    // Load folders on mount
    onMounted(() => {
        loadFolders();
    });

    return {
        folders,
        folderTree,
        selectedFolder,
        childrenFolders,
        loading,
        error,
        loadFolders,
        selectFolder,
        toggleExpansion,
        buildTree,
    };
}
