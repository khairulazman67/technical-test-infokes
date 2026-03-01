import { defineStore } from "pinia";
import { ref } from "vue";

export const useNotificationStore = defineStore("notification", () => {
  // State
  const isVisible = ref(false);
  const message = ref("");
  const color = ref<"success" | "error" | "warning" | "info">("success");
  const timeout = ref(3000);

  // Actions
  const showNotification = (
    msg: string,
    type: "success" | "error" | "warning" | "info" = "success",
    duration: number = 3000,
  ) => {
    message.value = msg;
    color.value = type;
    timeout.value = duration;
    isVisible.value = true;
  };

  const showSuccess = (msg: string, duration?: number) => {
    showNotification(msg, "success", duration);
  };

  const showError = (msg: string, duration?: number) => {
    showNotification(msg, "error", duration);
  };

  const showWarning = (msg: string, duration?: number) => {
    showNotification(msg, "warning", duration);
  };

  const showInfo = (msg: string, duration?: number) => {
    showNotification(msg, "info", duration);
  };

  const hide = () => {
    isVisible.value = false;
  };

  return {
    // State
    isVisible,
    message,
    color,
    timeout,
    // Actions
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hide,
  };
});
