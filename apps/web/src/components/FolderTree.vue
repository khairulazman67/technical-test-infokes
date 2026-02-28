<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Folder } from "../types/folder";
import { folderApi } from "../services/api";

interface Props {
  folders: Folder[];
  loading?: boolean;
  searchQuery?: string;
}

interface Emits {
  (e: "select", folder: Folder): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  searchQuery: "",
});

const emit = defineEmits<Emits>();

const localSearchQuery = ref(props.searchQuery);
const searchResults = ref<Folder[]>([]);
const isSearching = computed(() => localSearchQuery.value.trim().length > 0);
const searching = ref(false);

// Handle search input with API
const handleSearch = async () => {
  const query = localSearchQuery.value.trim();

  if (query.length === 0) {
    searchResults.value = [];
    return;
  }

  searching.value = true;
  try {
    searchResults.value = await folderApi.search(query);
  } catch (error) {
    console.error("Search error:", error);
    searchResults.value = [];
  } finally {
    searching.value = false;
  }
};

// Debounce search
let searchTimeout: ReturnType<typeof setTimeout>;
watch(localSearchQuery, () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    handleSearch();
  }, 300); // 300ms debounce
});

// Clear search
const clearSearch = () => {
  localSearchQuery.value = "";
  searchResults.value = [];
};

// Find folder by ID
const findFolderById = (items: Folder[], id: string): Folder | null => {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findFolderById(item.children, id);
      if (found) return found;
    }
  }
  return null;
};

const handleTreeActivation = (ids: string[]) => {
  if (ids.length > 0) {
    const folder = findFolderById(props.folders, ids[0]);
    if (folder) emit("select", folder);
  }
};
</script>

<template>
  <v-card flat class="fill-height d-flex flex-column">
    <v-card-title class="bg-grey-lighten-3">
      <v-icon class="mr-2">mdi-folder-outline</v-icon>
      Folder Structure
    </v-card-title>

    <!-- Search Bar -->
    <v-card-text class="pa-2">
      <v-text-field
        v-model="localSearchQuery"
        density="compact"
        placeholder="Search folders..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        clearable
        hide-details
        :loading="searching"
        @click:clear="clearSearch"
      ></v-text-field>
    </v-card-text>

    <v-card-text class="flex-grow-1 overflow-y-auto pa-0">
      <v-progress-linear v-if="loading" indeterminate></v-progress-linear>

      <!-- Search Results -->
      <div v-else-if="isSearching">
        <v-progress-linear v-if="searching" indeterminate></v-progress-linear>
        <v-list v-else-if="searchResults.length > 0">
          <v-list-item
            v-for="folder in searchResults"
            :key="folder.id"
            :title="folder.name"
            :subtitle="folder.path"
            @click="emit('select', folder)"
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
        @update:activated="handleTreeActivation"
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
</template>

<style scoped>
.fill-height {
  height: 100%;
}
</style>
