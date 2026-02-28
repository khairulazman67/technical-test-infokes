<template>
  <v-menu
    :model-value="modelValue"
    :style="`position: fixed; left: ${x}px; top: ${y}px;`"
    absolute
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-list density="compact">
      <v-list-item @click="handleAction('open')">
        <template v-slot:prepend>
          <v-icon>mdi-folder-open</v-icon>
        </template>
        <v-list-item-title>Open</v-list-item-title>
      </v-list-item>

      <v-list-item @click="handleAction('new-folder')">
        <template v-slot:prepend>
          <v-icon>mdi-folder-plus</v-icon>
        </template>
        <v-list-item-title>New Folder</v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item @click="handleAction('rename')">
        <template v-slot:prepend>
          <v-icon>mdi-pencil</v-icon>
        </template>
        <v-list-item-title>Rename</v-list-item-title>
      </v-list-item>

      <v-list-item @click="handleAction('delete')">
        <template v-slot:prepend>
          <v-icon color="error">mdi-delete</v-icon>
        </template>
        <v-list-item-title class="text-error">Delete</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import type { Folder } from "../types/folder";

interface Props {
  modelValue: boolean;
  x: number;
  y: number;
  folder: Folder | null;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "open"): void;
  (e: "new-folder"): void;
  (e: "rename"): void;
  (e: "delete"): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const handleAction = (action: "open" | "new-folder" | "rename" | "delete") => {
  emit(action);
  emit("update:modelValue", false);
};
</script>
