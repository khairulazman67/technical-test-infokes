<template>
  <v-container fluid class="pa-0 fill-height">
    <v-row no-gutters class="fill-height">
      <!-- Left Panel: Folder Tree -->
      <v-col cols="4" class="border-right">
        <v-card flat class="fill-height">
          <v-card-title class="bg-grey-lighten-3">
            <v-icon class="mr-2">mdi-folder-outline</v-icon>
            Folder Structure
          </v-card-title>

          <!-- Search Bar -->

          <v-card-text class="pa-2">
            <v-text-field
              v-model="searchQuery"
              density="compact"
              placeholder="Search folders..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              hide-details
              @input="handleSearch"
              @click:clear="clearSearch"
            ></v-text-field>
          </v-card-text>

          <v-card-text class="flex-grow-1 pa-0">
            <v-progress-linear v-if="loading" indeterminate></v-progress-linear>

            <!-- Search Results -->
            <div v-else-if="isSearching">
              <v-list v-if="searchResults.length > 0">
                <v-list-item
                  v-for="folder in searchResults"
                  :key="folder.id"
                  :title="folder.name"
                  :subtitle="folder.path"
                  @click="selectFolder(folder)"
                >
                  <template v-slot:prepend>
                    <v-icon>mdi-folder</v-icon>
                  </template>
                </v-list-item>
              </v-list>
              <div v-else class="pa-3 text-center text-grey">
                <v-icon size="40" color="grey-lighten-2"
                  >mdi-folder-search-outline</v-icon
                >
                <div class="text-body-2 mt-1">No folders found</div>
              </div>
            </div>

            <!-- Folder Tree -->
            <v-treeview
              v-else
              :items="folders"
              item-value="id"
              item-title="name"
              activatable
              open-on-click
              @update:activated="
                (ids) => {
                  if (ids.length > 0) {
                    const findFolder = (
                      items: Folder[],
                      id: string,
                    ): Folder | null => {
                      for (const item of items) {
                        if (item.id === id) return item;
                        if (item.children) {
                          const found = findFolder(item.children, id);
                          if (found) return found;
                        }
                      }
                      return null;
                    };
                    const folder = findFolder(folders, ids[0] as string);
                    if (folder) selectFolder(folder);
                  }
                }
              "
            >
              <template v-slot:prepend="{ item }">
                <v-icon>
                  {{
                    item.children && item.children.length > 0
                      ? "mdi-folder"
                      : "mdi-folder-outline"
                  }}
                </v-icon>
              </template>
            </v-treeview>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Right Panel: Direct Subfolders -->
      <v-col cols="8">
        <v-card flat class="fill-height">
          <v-card-title class="bg-grey-lighten-3">
            <v-icon class="mr-2">mdi-folder-open-outline</v-icon>
            {{ selectedFolder ? selectedFolder.name : "Select a folder" }}
          </v-card-title>

          <!-- Breadcrumb Navigation -->
          <v-card-text
            v-if="selectedFolder"
            class="py-1 px-2 bg-grey-lighten-5"
          >
            <v-breadcrumbs :items="breadcrumbs" density="compact" class="pa-0">
              <template v-slot:item="{ item }">
                <v-breadcrumbs-item
                  :disabled="!item.folder && !selectedFolder"
                  @click="
                    item.folder ? selectFolder(item.folder) : selectFolder(null)
                  "
                  class="cursor-pointer"
                >
                  {{ item.text }}
                </v-breadcrumbs-item>
              </template>
              <template v-slot:divider>
                <v-icon size="small">mdi-chevron-right</v-icon>
              </template>
            </v-breadcrumbs>
          </v-card-text>

          <v-card-text class="flex-grow-1 overflow-y-auto pa-0">
            <v-list v-if="subFolders.length > 0">
              <v-list-item
                v-for="folder in subFolders"
                :key="folder.id"
                :title="folder.name"
                :subtitle="folder.path"
                @contextmenu="showContextMenu($event, folder)"
                @dblclick="selectFolder(folder)"
              >
                <template v-slot:prepend>
                  <v-icon>mdi-folder</v-icon>
                </template>
              </v-list-item>
            </v-list>
            <div v-else-if="selectedFolder" class="pa-3 text-center text-grey">
              <v-icon size="40" color="grey-lighten-2"
                >mdi-folder-off-outline</v-icon
              >
              <div class="text-body-2 mt-1">No subfolders</div>
            </div>
            <div v-else class="pa-3 text-center text-grey">
              <v-icon size="40" color="grey-lighten-2"
                >mdi-folder-search-outline</v-icon
              >
              <div class="text-body-2 mt-1">
                Select a folder from the left panel
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Context Menu -->
    <v-menu
      v-model="contextMenu"
      :style="`position: fixed; left: ${contextMenuX}px; top: ${contextMenuY}px;`"
      absolute
    >
      <v-list density="compact">
        <v-list-item @click="openFolder">
          <template v-slot:prepend>
            <v-icon>mdi-folder-open</v-icon>
          </template>
          <v-list-item-title>Open</v-list-item-title>
        </v-list-item>

        <v-list-item @click="showNewFolderDialog">
          <template v-slot:prepend>
            <v-icon>mdi-folder-plus</v-icon>
          </template>
          <v-list-item-title>New Folder</v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item @click="showRenameDialog">
          <template v-slot:prepend>
            <v-icon>mdi-pencil</v-icon>
          </template>
          <v-list-item-title>Rename</v-list-item-title>
        </v-list-item>

        <v-list-item @click="showDeleteDialog">
          <template v-slot:prepend>
            <v-icon color="error">mdi-delete</v-icon>
          </template>
          <v-list-item-title class="text-error">Delete</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Rename Dialog -->
    <v-dialog v-model="renameDialog" max-width="400">
      <v-card>
        <v-card-title>Rename Folder</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="renameFolderName"
            label="Folder Name"
            variant="outlined"
            autofocus
            @keyup.enter="renameFolder"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="renameDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="renameFolder">Rename</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Delete Folder</v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ contextMenuFolder?.name }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="deleteFolder">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- New Folder Dialog -->
    <v-dialog v-model="newFolderDialog" max-width="400">
      <v-card>
        <v-card-title>New Folder</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newFolderName"
            label="Folder Name"
            variant="outlined"
            autofocus
            @keyup.enter="createNewFolder"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="newFolderDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="createNewFolder">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { mockFolders } from "../mock/folderData";
import type { Folder } from "../types/folder";

const folders = ref<Folder[]>([]);
const selectedFolder = ref<Folder | null>(null);
const subFolders = ref<Folder[]>([]);
const loading = ref(false);
const searchQuery = ref("");
const searchResults = ref<Folder[]>([]);
const isSearching = computed(() => searchQuery.value.trim().length > 0);

// Context menu
const contextMenu = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const contextMenuFolder = ref<Folder | null>(null);

// Dialogs
const renameDialog = ref(false);
const deleteDialog = ref(false);
const newFolderDialog = ref(false);
const newFolderName = ref("");
const renameFolderName = ref("");

// Breadcrumb navigation
const breadcrumbs = computed(() => {
  if (!selectedFolder.value) return [];

  const crumbs: Array<{ text: string; folder: Folder | null }> = [
    { text: "Root", folder: null },
  ];

  const path = selectedFolder.value.path.split("/").filter((p) => p);
  let currentPath = "";

  for (const segment of path) {
    currentPath += "/" + segment;
    const folder = findFolderByPath(folders.value, currentPath);
    if (folder) {
      crumbs.push({ text: folder.name, folder });
    }
  }

  return crumbs;
});

// Find folder by path
const findFolderByPath = (items: Folder[], path: string): Folder | null => {
  for (const item of items) {
    if (item.path === path) return item;
    if (item.children) {
      const found = findFolderByPath(item.children, path);
      if (found) return found;
    }
  }
  return null;
};

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

// Recursive search function
const searchFolders = (items: Folder[], query: string): Folder[] => {
  const results: Folder[] = [];
  const lowerQuery = query.toLowerCase();

  const search = (folders: Folder[]) => {
    for (const folder of folders) {
      if (folder.name.toLowerCase().includes(lowerQuery)) {
        results.push(folder);
      }
      if (folder.children && folder.children.length > 0) {
        search(folder.children);
      }
    }
  };

  search(items);
  return results;
};

// Handle search input
const handleSearch = () => {
  if (searchQuery.value.trim().length === 0) {
    searchResults.value = [];
    return;
  }
  searchResults.value = searchFolders(folders.value, searchQuery.value);
};

// Clear search
const clearSearch = () => {
  searchQuery.value = "";
  searchResults.value = [];
};

// Handle folder selection
const selectFolder = (folder: Folder | null) => {
  selectedFolder.value = folder;
  subFolders.value = folder?.children || [];
};

// Context menu handlers
const showContextMenu = (e: MouseEvent, folder: Folder) => {
  e.preventDefault();
  contextMenu.value = false;
  contextMenuX.value = e.clientX;
  contextMenuY.value = e.clientY;
  contextMenuFolder.value = folder;
  setTimeout(() => {
    contextMenu.value = true;
  }, 10);
};

const openFolder = () => {
  if (contextMenuFolder.value) {
    selectFolder(contextMenuFolder.value);
  }
  contextMenu.value = false;
};

const showRenameDialog = () => {
  if (contextMenuFolder.value) {
    renameFolderName.value = contextMenuFolder.value.name;
    renameDialog.value = true;
  }
  contextMenu.value = false;
};

const showDeleteDialog = () => {
  deleteDialog.value = true;
  contextMenu.value = false;
};

const showNewFolderDialog = () => {
  newFolderName.value = "";
  newFolderDialog.value = true;
  contextMenu.value = false;
};

const renameFolder = () => {
  if (contextMenuFolder.value && renameFolderName.value.trim()) {
    // TODO: Call API to rename folder
    console.log(
      "Rename folder:",
      contextMenuFolder.value.name,
      "to",
      renameFolderName.value,
    );
    contextMenuFolder.value.name = renameFolderName.value;
    renameDialog.value = false;
  }
};

const deleteFolder = () => {
  if (contextMenuFolder.value && selectedFolder.value) {
    // TODO: Call API to delete folder
    console.log("Delete folder:", contextMenuFolder.value.name);
    const index = subFolders.value.findIndex(
      (f) => f.id === contextMenuFolder.value?.id,
    );
    if (index > -1) {
      subFolders.value.splice(index, 1);
    }
    deleteDialog.value = false;
  }
};

const createNewFolder = () => {
  if (newFolderName.value.trim() && contextMenuFolder.value) {
    // TODO: Call API to create new folder
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: newFolderName.value,
      path: `${contextMenuFolder.value.path}/${newFolderName.value}`,
      children: [],
    };

    console.log("Create new folder:", newFolder);

    if (!contextMenuFolder.value.children) {
      contextMenuFolder.value.children = [];
    }
    contextMenuFolder.value.children.push(newFolder);

    // Refresh subfolders if current folder is selected
    if (selectedFolder.value?.id === contextMenuFolder.value.id) {
      subFolders.value = contextMenuFolder.value.children;
    }

    newFolderDialog.value = false;
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

.cursor-pointer {
  cursor: pointer;
}

.v-list-item {
  cursor: pointer;
}
</style>
