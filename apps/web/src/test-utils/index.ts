import type { ComponentMountingOptions } from "@vue/test-utils";
import { mount, VueWrapper } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

/**
 * Helper function to mount Vue components with Vuetify
 */
export function mountWithVuetify<T>(
  component: T,
  options?: ComponentMountingOptions<any>,
): VueWrapper<any> {
  const vuetify = createVuetify({
    components,
    directives,
  });

  return mount(component as any, {
    global: {
      plugins: [vuetify],
      ...options?.global,
    },
    ...options,
  });
}

/**
 * Helper to create mock folder data
 */
export function createMockFolder(overrides = {}) {
  return {
    id: "1",
    name: "Test Folder",
    path: "/test-folder",
    parentId: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    ...overrides,
  };
}

/**
 * Helper to create mock folder tree data
 */
export function createMockFolderTree(overrides = {}) {
  return {
    id: "1",
    name: "Test Folder",
    path: "/test-folder",
    children: [],
    ...overrides,
  };
}

/**
 * Helper to wait for async updates
 */
export async function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
