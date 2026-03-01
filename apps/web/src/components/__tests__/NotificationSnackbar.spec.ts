import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useNotificationStore } from "../../stores/notification";
import { mountWithVuetify } from "../../test-utils";
import NotificationSnackbar from "../NotificationSnackbar.vue";

describe("NotificationSnackbar", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders snackbar component", () => {
    const wrapper = mountWithVuetify(NotificationSnackbar);
    expect(wrapper.find(".v-snackbar").exists()).toBe(true);
  });

  it("displays success message with correct color", async () => {
    const wrapper = mountWithVuetify(NotificationSnackbar);
    const store = useNotificationStore();

    store.showSuccess("Success message");
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Success message");
    expect(wrapper.find(".v-snackbar").classes()).toContain("bg-success");
  });

  it("displays error message with correct color", async () => {
    const wrapper = mountWithVuetify(NotificationSnackbar);
    const store = useNotificationStore();

    store.showError("Error message");
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Error message");
    expect(wrapper.find(".v-snackbar").classes()).toContain("bg-error");
  });

  it("displays warning message with correct color", async () => {
    const wrapper = mountWithVuetify(NotificationSnackbar);
    const store = useNotificationStore();

    store.showWarning("Warning message");
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Warning message");
    expect(wrapper.find(".v-snackbar").classes()).toContain("bg-warning");
  });

  it("displays info message with correct color", async () => {
    const wrapper = mountWithVuetify(NotificationSnackbar);
    const store = useNotificationStore();

    store.showInfo("Info message");
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Info message");
    expect(wrapper.find(".v-snackbar").classes()).toContain("bg-info");
  });

  it("shows close button", async () => {
    const wrapper = mountWithVuetify(NotificationSnackbar);
    const store = useNotificationStore();

    store.showSuccess("Test message");
    await wrapper.vm.$nextTick();

    const closeButton = wrapper.find(".mdi-close");
    expect(closeButton.exists()).toBe(true);
  });

  it("closes snackbar when close button is clicked", async () => {
    const wrapper = mountWithVuetify(NotificationSnackbar);
    const store = useNotificationStore();

    store.showSuccess("Test message");
    await wrapper.vm.$nextTick();

    const closeButton = wrapper.find(".mdi-close");
    await closeButton.trigger("click");

    expect(store.visible).toBe(false);
  });

  it("auto-hides after timeout", async () => {
    const wrapper = mountWithVuetify(NotificationSnackbar);
    const store = useNotificationStore();

    store.showSuccess("Test message");
    expect(store.visible).toBe(true);

    // Wait for timeout (default 3000ms)
    await new Promise((resolve) => setTimeout(resolve, 3100));
    expect(store.visible).toBe(false);
  });
});
