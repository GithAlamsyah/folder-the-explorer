<template>
  <div 
    class="folder-tree-node" 
    :style="{ paddingLeft: `${depth * 20}px` }"
  >
    <div 
      class="folder-row"
      :class="{ 'selected': node.id === selectedId }"
      @click="handleClick"
    >
      <span 
        class="expand-icon"
        v-if="node.children.length > 0"
        @click.stop="toggleExpand"
      >
        {{ node.isExpanded ? '▼' : '▶' }}
      </span>
      <span class="expand-icon-placeholder" v-else></span>
      
      <span class="folder-icon">
        {{ node.isExpanded ? '📂' : '📁' }}
      </span>
      
      <span class="folder-name">{{ node.name }}</span>
    </div>

    <!-- Recursive rendering of children -->
    <div v-if="node.isExpanded && node.children.length > 0" class="folder-children">
      <FolderTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :selected-id="selectedId"
        :depth="depth + 1"
        @select="$emit('select', $event)"
        @toggle="$emit('toggle', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FolderNode } from '../types';

interface Props {
  node: FolderNode;
  selectedId: string | null;
  depth?: number;
}

const props = withDefaults(defineProps<Props>(), {
  depth: 0,
});

const emit = defineEmits<{
  select: [folder: FolderNode];
  toggle: [folder: FolderNode];
}>();

const handleClick = () => {
  emit('select', props.node);
};

const toggleExpand = () => {
  emit('toggle', props.node);
};
</script>

<style scoped>
.folder-tree-node {
  user-select: none;
}

.folder-row {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.folder-row:hover {
  background-color: #f0f0f0;
}

.folder-row.selected {
  background-color: #e3f2fd;
  font-weight: 500;
}

.expand-icon {
  display: inline-block;
  width: 16px;
  font-size: 12px;
  cursor: pointer;
  margin-right: 4px;
}

.expand-icon-placeholder {
  display: inline-block;
  width: 16px;
  margin-right: 4px;
}

.folder-icon {
  margin-right: 6px;
  font-size: 16px;
}

.folder-name {
  font-size: 14px;
  color: #333;
}

.folder-children {
  margin-left: 0;
}
</style>
