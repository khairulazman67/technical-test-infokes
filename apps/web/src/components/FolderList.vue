<template>
  <v-card flat class="fill-height">
    <v-card-title class="bg-grey-lighten-3">
      <v-icon class="mr-2">mdi-folder-open-outline</v-icon>
      {{ selectedFolder ? selectedFolder.name : "Select a folder" }}
    </v-card-title>

    <!-- Breadcrumb Navigation -->
    <v-card-text
      v-if="selectedFolder && breadcrumbs.length > 0"
      class="py-1 px-2 bg-grey-lighten-5"
    >
      <v-breadcrumbs density="compact" class="pa-0">
        <template v-for="(item, index) in breadcrumbs" :key="index">
          <v-breadcrumbs-item
            :disabled="!item.folder && !selectedFolder"
            @click="emit('breadcrumb-click', item.folder)"
            class="cursor-pointer"
          >
            {{ item.text }}
          </v-breadcrumbs-item>
          <v-breadcrumbs-divider v-if="index < breadcrumbs.length - 1">
            <v-icon size="small">mdi-chevron-right</v-icon>
          </v-breadcrumbs-divider>
        </template>
      </v-breadcrumbs>
    </v-card-text>

    <v-card-text class="flex-grow-1 overflow-y-auto pa-0">
      <v-list v-if="hasFolders">
        <v-list-item
          v-for="folder in folders"
          :key="folder.id"
          :title="folder.name"
          :subtitle="folder.path"
          @contextmenu="emit('contextmenu', $event, folder)"
          @dblclick="emit('select', folder)"
        >
          <template v-slot:prepend>
            <v-icon>mdi-folder</v-icon>
          </template>
        </v-list-item>
      </v-list>
      <div v-else-if="selectedFolder" class="pa-3 text-center text-grey">
        <v-icon size="40" color="grey-lighten-2">mdi-folder-off-outline</v-icon>
        <div class="text-body-2 mt-1">No subfolders</div>
      </div>
      <div v-else class="pa-3 text-center text-grey">
        <v-icon size="40" color="grey-lighten-2"
          >mdi-folder-search-outline</v-icon
        >
        <div class="text-body-2 mt-1">Select a folder from the left panel</div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { FolderOrTree, FolderTreeDTO } from "../types/folder";

interface Props {
  folders: FolderOrTree[];
  selectedFolder: FolderOrTree | null;
  breadcrumbs?: Array<{ text: string; folder: FolderOrTree | null }>;
}

interface Emits {
  (e: "select", folder: FolderOrTree): void;
  (e: "contextmenu", event: MouseEvent, folder: FolderOrTree): void;
  (e: "breadcrumb-click", folder: FolderOrTree | null): void;
}

const props = withDefaults(defineProps<Props>(), {
  breadcrumbs: () => [],
});

const emit = defineEmits<Emits>();

const hasFolders = computed(() => props.folders.length > 0);
</script>

<style scoped>
.fill-height {
  height: 100%;
}

.cursor-pointer {
  cursor: pointer;
}

.v-list-item {
  cursor: pointer;
}
</style>
