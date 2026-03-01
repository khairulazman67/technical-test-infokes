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

<style>
/* Force light theme - override browser dark mode */
html,
body,
#app,
.v-application {
  background-color: #ffffff !important;
  color: rgba(0, 0, 0, 0.87) !important;
}

/* Ensure all Vuetify components use light theme */
.v-application .v-card,
.v-application .v-sheet,
.v-application .v-list,
.v-application .v-menu__content,
.v-application .v-dialog {
  background-color: #ffffff !important;
}

/* Override dark mode text colors */
.v-application .text--primary {
  color: rgba(0, 0, 0, 0.87) !important;
}

.v-application .text--secondary {
  color: rgba(0, 0, 0, 0.6) !important;
}
</style>
