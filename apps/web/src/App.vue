<script setup lang="ts">
import NotificationSnackbar from "./components/NotificationSnackbar.vue";
import FolderExplorer from "./pages/FolderExplorer.vue";
</script>

<template>
  <v-app>
    <FolderExplorer />
    <!-- Global Notification Snackbar -->
    <NotificationSnackbar />
  </v-app>
</template>

<style scoped></style>
