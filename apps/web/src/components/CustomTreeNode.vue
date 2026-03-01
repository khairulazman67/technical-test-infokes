<template>
  <div class="tree-node">
    <div
      class="tree-node-content"
      :class="{
        'tree-node-selected': isSelected,
        'tree-node-has-children': hasChildren,
      }"
      :style="{ paddingLeft: `${level * 16 + 8}px` }"
      @click="handleClick"
    >
      <!-- Expand/Collapse Icon -->
      <div class="tree-node-toggle" @click.stop="toggleExpand">
        <v-icon v-if="hasChildren" size="small">
          {{ isExpanded ? "mdi-chevron-down" : "mdi-chevron-right" }}
        </v-icon>
        <span v-else class="tree-node-spacer"></span>
      </div>

      <!-- Folder Icon -->
      <v-icon class="tree-node-icon" size="small">
        {{ hasChildren ? "mdi-folder" : "mdi-folder-outline" }}
      </v-icon>

      <!-- Folder Name -->
      <span class="tree-node-label">{{ node.name }}</span>
    </div>

    <!-- Children -->
    <div v-if="hasChildren && isExpanded" class="tree-node-children">
      <CustomTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="level + 1"
        :selected-id="selectedId"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { FolderOrTree } from "../types/folder";

interface Props {
  node: FolderOrTree;
  level: number;
  selectedId: string | null;
}

interface Emits {
  (e: "select", folder: FolderOrTree): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isExpanded = ref(false);

const hasChildren = computed(
  () => props.node.children && props.node.children.length > 0,
);

const isSelected = computed(() => props.selectedId === props.node.id);

const toggleExpand = () => {
  if (hasChildren.value) {
    isExpanded.value = !isExpanded.value;
  }
};

const handleClick = () => {
  emit("select", props.node);
  // Auto-expand when selected
  if (hasChildren.value && !isExpanded.value) {
    isExpanded.value = true;
  }
};
</script>

<style scoped>
.tree-node {
  user-select: none;
}

.tree-node-content {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 4px;
  margin: 2px 4px;
}

.tree-node-content:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.tree-node-selected {
  background-color: rgba(25, 118, 210, 0.12) !important;
}

.tree-node-selected:hover {
  background-color: rgba(25, 118, 210, 0.16) !important;
}

.tree-node-toggle {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  cursor: pointer;
  border-radius: 4px;
}

.tree-node-toggle:hover {
  background-color: rgba(0, 0, 0, 0.08);
}

.tree-node-spacer {
  width: 20px;
  height: 20px;
  display: inline-block;
}

.tree-node-icon {
  margin-right: 8px;
}

.tree-node-label {
  flex: 1;
  font-size: 14px;
}
</style>
