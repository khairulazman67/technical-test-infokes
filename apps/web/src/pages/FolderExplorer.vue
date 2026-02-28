<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import type { Folder } from "../types/folder";
import { mockFolders } from "../mock/folderData";
import { useFolderOperations } from "../composables/useFolderOperations";
import FolderTree from "../components/FolderTree.vue";
import FolderList from "../components/FolderList.vue";
import FolderContextMenu from "../components/FolderContextMenu.vue";
import FolderDialogs from "../components/FolderDialogs.vue";

const folders = ref<Folder[]>([]);
const selectedFolder = ref<Folder | null>(null);
const subFolders = ref<Folder[]>([]);
const loading = ref(false);

// Context menu
const contextMenu = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);

// Dialogs
const renameDialog = ref(false);
const deleteDialog = ref(false);
const newFolderDialog = ref(false);

// Use composable
const {
  contextMenuFolder,
  generateBreadcrumbs,
  renameFolder,
  deleteFolder,
  createNewFolder,
} = useFolderOperations();

// Breadcrumbs
const breadcrumbs = computed(() =>
  generateBreadcrumbs(selectedFolder.value, folders.value),
);

// Fetch folder structure from backend
const fetchFolders = async () => {
  loading.value = true;
  try {
    // TODO: Replace with actual API endpoint
    // const response = await fetch("/api/folders");
    // folders.value = await response.json();

    // Using mock data for now
    await new Promise((resolve) => setTimeout(resolve, 500));
    folders.value = mockFolders;
  } catch (error) {
    console.error("Error fetching folders:", error);
  } finally {
    loading.value = false;
  }
};

// Handle folder selection
const handleSelectFolder = (folder: Folder | null) => {
  selectedFolder.value = folder;
  subFolders.value = folder?.children || [];
};

// Context menu handlers
const handleContextMenu = (e: MouseEvent, folder: Folder) => {
  e.preventDefault();
  contextMenu.value = false;
  contextMenuX.value = e.clientX;
  contextMenuY.value = e.clientY;
  contextMenuFolder.value = folder;
  setTimeout(() => {
    contextMenu.value = true;
  }, 10);
};

const handleOpenFolder = () => {
  if (contextMenuFolder.value) {
    handleSelectFolder(contextMenuFolder.value);
  }
};

const handleShowRenameDialog = () => {
  renameDialog.value = true;
};

const handleShowDeleteDialog = () => {
  deleteDialog.value = true;
};

const handleShowNewFolderDialog = () => {
  newFolderDialog.value = true;
};

// Dialog actions
const handleRename = (newName: string) => {
  if (contextMenuFolder.value) {
    renameFolder(contextMenuFolder.value, newName);
  }
};

const handleDelete = () => {
  if (contextMenuFolder.value) {
    deleteFolder(contextMenuFolder.value, subFolders.value);
  }
};

const handleCreate = (name: string) => {
  if (contextMenuFolder.value) {
    const newFolder = createNewFolder(contextMenuFolder.value, name);

    // Refresh subfolders if current folder is selected
    if (selectedFolder.value?.id === contextMenuFolder.value.id) {
      subFolders.value = contextMenuFolder.value.children || [];
    }
  }
};

onMounted(() => {
  fetchFolders();
});
</script>

<template>
  <v-container fluid class="pa-0 fill-height">
    <v-row no-gutters class="fill-height">
      <!-- Left Panel: Folder Tree -->
      <v-col cols="4" class="border-right">
        <FolderTree
          :folders="folders"
          :loading="loading"
          @select="handleSelectFolder"
        />
      </v-col>

      <!-- Right Panel: Folder List -->
      <v-col cols="8">
        <FolderList
          :folders="subFolders"
          :selected-folder="selectedFolder"
          :breadcrumbs="breadcrumbs"
          @select="handleSelectFolder"
          @contextmenu="handleContextMenu"
          @breadcrumb-click="handleSelectFolder"
        />
      </v-col>
    </v-row>

    <!-- Context Menu -->
    <FolderContextMenu
      v-model="contextMenu"
      :x="contextMenuX"
      :y="contextMenuY"
      :folder="contextMenuFolder"
      @open="handleOpenFolder"
      @new-folder="handleShowNewFolderDialog"
      @rename="handleShowRenameDialog"
      @delete="handleShowDeleteDialog"
    />

    <!-- Dialogs -->
    <FolderDialogs
      v-model:rename-dialog="renameDialog"
      v-model:delete-dialog="deleteDialog"
      v-model:new-folder-dialog="newFolderDialog"
      :folder="contextMenuFolder"
      @rename="handleRename"
      @delete="handleDelete"
      @create="handleCreate"
    />
  </v-container>
</template>

<style scoped>
.border-right {
  border-right: 1px solid #e0e0e0;
}

.fill-height {
  height: 100vh;
}
</style>
