<template>
  <div class="folder-explorer">
    <div class="error-message" v-if="error">
      <p>⚠️ {{ error }}</p>
      <button @click="loadFolders">Retry</button>
    </div>

    <div class="explorer-container" v-else>
      <!-- Left Panel: Folder Tree -->
      <div class="left-panel">
        <FolderTree 
          :folders="folders"
          :selected-id="selectedFolder?.id ?? null"
          :loading="loading"
          @select="selectFolder"
        />
      </div>

      <!-- Resizer -->
      <div class="resizer"></div>

      <!-- Right Panel: Folder Children List -->
      <div class="right-panel">
        <FolderList 
          :folders="childrenFolders"
          :parent-name="selectedFolder?.name"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFolders } from '../composables/useFolders';
import FolderTree from './FolderTree.vue';
import FolderList from './FolderList.vue';

const {
  folders,
  selectedFolder,
  childrenFolders,
  loading,
  error,
  loadFolders,
  selectFolder,
} = useFolders();
</script>

<style scoped>
.folder-explorer {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.error-message {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background-color: #fff3cd;
  color: #856404;
}

.error-message button {
  padding: 8px 16px;
  background-color: #ffc107;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.error-message button:hover {
  background-color: #ffb300;
}

.explorer-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.left-panel {
  width: 35%;
  min-width: 250px;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.resizer {
  width: 4px;
  background-color: #ddd;
  cursor: col-resize;
  transition: background-color 0.2s;
}

.resizer:hover {
  background-color: #2196f3;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Responsive design */
@media (max-width: 768px) {
  .explorer-container {
    flex-direction: column;
  }

  .left-panel {
    width: 100%;
    max-width: none;
    height: 40%;
  }

  .resizer {
    width: 100%;
    height: 4px;
    cursor: row-resize;
  }

  .right-panel {
    height: 60%;
  }
}
</style>
