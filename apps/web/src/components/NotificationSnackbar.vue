<template>
  <v-snackbar
    v-model="notificationStore.isVisible"
    :color="notificationStore.color"
    :timeout="notificationStore.timeout"
    location="top right"
  >
    {{ notificationStore.message }}
    <template v-slot:actions>
      <v-btn variant="text" @click="notificationStore.hide">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useNotificationStore } from "../stores/notification";

const notificationStore = useNotificationStore();
</script>
