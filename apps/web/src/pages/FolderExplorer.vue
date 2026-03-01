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

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import FolderContextMenu from "../components/FolderContextMenu.vue";
import FolderDialogs from "../components/FolderDialogs.vue";
import FolderList from "../components/FolderList.vue";
import FolderTree from "../components/FolderTree.vue";
import { useFolderOperations } from "../composables/useFolderOperations";
import { useNotificationStore } from "../stores/notification";
import type { FolderOrTree, FolderTreeDTO } from "../types/folder";

const folders = ref<FolderTreeDTO[]>([]);
const selectedFolder = ref<FolderOrTree | null>(null);
const subFolders = ref<FolderOrTree[]>([]);
const loading = ref(false);

// Use notification store
const notificationStore = useNotificationStore();

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
  fetchFolderTree,
  getFolderById,
} = useFolderOperations();

// Breadcrumbs
const breadcrumbs = computed(() =>
  generateBreadcrumbs(selectedFolder.value, folders.value),
);

// Fetch folder structure from backend
const fetchFolders = async () => {
  loading.value = true;
  try {
    folders.value = await fetchFolderTree();
  } catch (error) {
    console.error("Error fetching folders:", error);
    notificationStore.showError("Failed to load folders");
  } finally {
    loading.value = false;
  }
};

// Handle folder selection
const handleSelectFolder = (folder: FolderOrTree | null) => {
  selectedFolder.value = folder;
  subFolders.value = folder?.children || [];
};

// Context menu handlers
const handleContextMenu = (e: MouseEvent, folder: FolderOrTree) => {
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
const handleRename = async (newName: string) => {
  if (!contextMenuFolder.value) return;

  try {
    await renameFolder(contextMenuFolder.value.id, newName);
    notificationStore.showSuccess("Folder renamed successfully");
    await fetchFolders();
  } catch (error) {
    console.error("Error renaming folder:", error);
    notificationStore.showError("Failed to rename folder");
  }
};

const handleDelete = async () => {
  if (!contextMenuFolder.value) return;

  try {
    await deleteFolder(contextMenuFolder.value.id);
    notificationStore.showSuccess("Folder deleted successfully");

    // Clear selection if deleted folder was selected
    if (selectedFolder.value?.id === contextMenuFolder.value.id) {
      selectedFolder.value = null;
      subFolders.value = [];
    }

    await fetchFolders();
  } catch (error) {
    console.error("Error deleting folder:", error);
    notificationStore.showError("Failed to delete folder");
  }
};

const handleCreate = async (name: string) => {
  if (!contextMenuFolder.value) return;

  try {
    await createNewFolder(contextMenuFolder.value.id, name);
    notificationStore.showSuccess("Folder created successfully");
    await fetchFolders();

    // Refresh subfolders if current folder is selected
    if (selectedFolder.value?.id === contextMenuFolder.value.id) {
      const updatedFolder = await getFolderById(contextMenuFolder.value.id);
      subFolders.value = updatedFolder.children || [];
    }
  } catch (error) {
    console.error("Error creating folder:", error);
    notificationStore.showError("Failed to create folder");
  }
};

onMounted(() => {
  fetchFolders();
});
</script>

<style scoped>
.border-right {
  border-right: 1px solid #e0e0e0;
}

.fill-height {
  height: 100vh;
}
</style>
