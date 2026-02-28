<script setup lang="ts">
import { ref, watch } from "vue";
import type { Folder } from "../types/folder";

interface Props {
  renameDialog: boolean;
  deleteDialog: boolean;
  newFolderDialog: boolean;
  folder: Folder | null;
}

interface Emits {
  (e: "update:renameDialog", value: boolean): void;
  (e: "update:deleteDialog", value: boolean): void;
  (e: "update:newFolderDialog", value: boolean): void;
  (e: "rename", name: string): void;
  (e: "delete"): void;
  (e: "create", name: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const renameFolderName = ref("");
const newFolderName = ref("");

// Watch for dialog open to set initial values
watch(
  () => props.renameDialog,
  (isOpen) => {
    if (isOpen && props.folder) {
      renameFolderName.value = props.folder.name;
    }
  },
);

watch(
  () => props.newFolderDialog,
  (isOpen) => {
    if (isOpen) {
      newFolderName.value = "";
    }
  },
);

const handleRename = () => {
  if (renameFolderName.value.trim()) {
    emit("rename", renameFolderName.value);
    emit("update:renameDialog", false);
  }
};

const handleDelete = () => {
  emit("delete");
  emit("update:deleteDialog", false);
};

const handleCreate = () => {
  if (newFolderName.value.trim()) {
    emit("create", newFolderName.value);
    emit("update:newFolderDialog", false);
  }
};
</script>

<template>
  <!-- Rename Dialog -->
  <v-dialog
    :model-value="renameDialog"
    max-width="400"
    @update:model-value="emit('update:renameDialog', $event)"
  >
    <v-card>
      <v-card-title>Rename Folder</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="renameFolderName"
          label="Folder Name"
          variant="outlined"
          autofocus
          @keyup.enter="handleRename"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="emit('update:renameDialog', false)">Cancel</v-btn>
        <v-btn color="primary" @click="handleRename">Rename</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Delete Dialog -->
  <v-dialog
    :model-value="deleteDialog"
    max-width="400"
    @update:model-value="emit('update:deleteDialog', $event)"
  >
    <v-card>
      <v-card-title>Delete Folder</v-card-title>
      <v-card-text>
        Are you sure you want to delete "{{ folder?.name }}"?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="emit('update:deleteDialog', false)">Cancel</v-btn>
        <v-btn color="error" @click="handleDelete">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- New Folder Dialog -->
  <v-dialog
    :model-value="newFolderDialog"
    max-width="400"
    @update:model-value="emit('update:newFolderDialog', $event)"
  >
    <v-card>
      <v-card-title>New Folder</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="newFolderName"
          label="Folder Name"
          variant="outlined"
          autofocus
          @keyup.enter="handleCreate"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="emit('update:newFolderDialog', false)">Cancel</v-btn>
        <v-btn color="primary" @click="handleCreate">Create</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
