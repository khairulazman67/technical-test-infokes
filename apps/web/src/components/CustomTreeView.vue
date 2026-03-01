<template>
  <div class="custom-tree-view">
    <CustomTreeNode
      v-for="node in items"
      :key="node.id"
      :node="node"
      :level="0"
      :selected-id="selectedId"
      @select="handleSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import CustomTreeNode from "./CustomTreeNode.vue";
import type { FolderOrTree, FolderTreeDTO } from "../types/folder";

interface Props {
  items: FolderTreeDTO[];
}

interface Emits {
  (e: "select", folder: FolderOrTree): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const selectedId = ref<string | null>(null);

const handleSelect = (folder: FolderOrTree) => {
  selectedId.value = folder.id;
  emit("select", folder);
};
</script>

<style scoped>
.custom-tree-view {
  width: 100%;
}
</style>
