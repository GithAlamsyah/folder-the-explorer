<template>
  <div class="folder-tree">
    <div class="folder-tree-header">
      <h3>Folder Structure</h3>
    </div>
    
    <div class="folder-tree-content" v-if="!loading">
      <FolderTreeNode
        v-for="node in treeData"
        :key="node.id"
        :node="node"
        :selected-id="selectedId"
        @select="handleSelect"
        @toggle="handleToggle"
      />
    </div>

    <div class="loading-state" v-else>
      <p>Loading folders...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Folder, FolderNode } from '../types';
import FolderTreeNode from './FolderTreeNode.vue';

interface Props {
  folders: Folder[];
  selectedId: string | null;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  select: [folder: Folder];
}>();

const treeData = ref<FolderNode[]>([]);

/**
 * Build tree structure from flat folder array
 */
const buildTree = (flatFolders: Folder[]): FolderNode[] => {
  const folderMap = new Map<string, FolderNode>();
  const rootFolders: FolderNode[] = [];

  // Create folder nodes
  flatFolders.forEach(folder => {
    folderMap.set(folder.id, {
      ...folder,
      children: [],
      isExpanded: false,
    });
  });

  // Build hierarchy
  flatFolders.forEach(folder => {
    const node = folderMap.get(folder.id)!;
    
    if (folder.parentId === null) {
      rootFolders.push(node);
    } else {
      const parent = folderMap.get(folder.parentId);
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return rootFolders;
};

// Watch for folder changes
watch(() => props.folders, (newFolders) => {
  treeData.value = buildTree(newFolders);
}, { immediate: true });

const handleSelect = (folder: FolderNode) => {
  emit('select', folder);
};

const handleToggle = (folder: FolderNode) => {
  folder.isExpanded = !folder.isExpanded;
};
</script>

<style scoped>
.folder-tree {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fafafa;
  border-right: 1px solid #ddd;
}

.folder-tree-header {
  padding: 16px;
  border-bottom: 1px solid #ddd;
  background-color: #fff;
}

.folder-tree-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.folder-tree-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.loading-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}
</style>
