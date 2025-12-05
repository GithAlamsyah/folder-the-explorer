<template>
  <div class="folder-list">
    <div class="folder-list-header">
      <h3>{{ parentName ? `Contents of "${parentName}"` : 'Select a folder' }}</h3>
    </div>
    
    <div class="folder-list-content" v-if="folders.length > 0">
      <div 
        v-for="folder in folders" 
        :key="folder.id"
        class="folder-item"
      >
        <span class="folder-icon">📁</span>
        <span class="folder-name">{{ folder.name }}</span>
        <span class="folder-path">{{ folder.path }}</span>
      </div>
    </div>

    <div class="empty-state" v-else>
      <p v-if="parentName">No subfolders</p>
      <p v-else>Select a folder from the left panel to view its contents</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Folder } from '../types';

interface Props {
  folders: Folder[];
  parentName?: string;
}

withDefaults(defineProps<Props>(), {
  parentName: '',
});
</script>

<style scoped>
.folder-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.folder-list-header {
  padding: 16px;
  border-bottom: 1px solid #ddd;
  background-color: #fafafa;
}

.folder-list-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.folder-list-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  align-content: start;
}

.folder-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: default;
  transition: all 0.2s;
  background-color: #fff;
}

.folder-item:hover {
  background-color: #f5f5f5;
  border-color: #2196f3;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.folder-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.folder-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  text-align: center;
  margin-bottom: 4px;
}

.folder-path {
  font-size: 11px;
  color: #999;
  text-align: center;
  word-break: break-all;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}

.empty-state p {
  margin: 0;
}
</style>
