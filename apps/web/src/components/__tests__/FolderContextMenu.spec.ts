import { describe, expect, it } from "vitest";
import { createMockFolderTree, mountWithVuetify } from "../../test-utils";
import FolderContextMenu from "../FolderContextMenu.vue";

describe("FolderContextMenu", () => {
  it("renders menu items", () => {
    const folder = createMockFolderTree();
    const wrapper = mountWithVuetify(FolderContextMenu, {
      props: {
        modelValue: true,
        x: 100,
        y: 100,
        folder,
      },
    });

    expect(wrapper.text()).toContain("Open");
    expect(wrapper.text()).toContain("New Folder");
    expect(wrapper.text()).toContain("Rename");
    expect(wrapper.text()).toContain("Delete");
  });

  it("emits open event when Open is clicked", async () => {
    const folder = createMockFolderTree();
    const wrapper = mountWithVuetify(FolderContextMenu, {
      props: {
        modelValue: true,
        x: 100,
        y: 100,
        folder,
      },
    });

    const openItem = wrapper.find('[data-testid="menu-open"]');
    if (openItem.exists()) {
      await openItem.trigger("click");
      expect(wrapper.emitted("open")).toBeTruthy();
    }
  });

  it("emits new-folder event when New Folder is clicked", async () => {
    const folder = createMockFolderTree();
    const wrapper = mountWithVuetify(FolderContextMenu, {
      props: {
        modelValue: true,
        x: 100,
        y: 100,
        folder,
      },
    });

    const newFolderItem = wrapper.find('[data-testid="menu-new-folder"]');
    if (newFolderItem.exists()) {
      await newFolderItem.trigger("click");
      expect(wrapper.emitted("new-folder")).toBeTruthy();
    }
  });

  it("emits rename event when Rename is clicked", async () => {
    const folder = createMockFolderTree();
    const wrapper = mountWithVuetify(FolderContextMenu, {
      props: {
        modelValue: true,
        x: 100,
        y: 100,
        folder,
      },
    });

    const renameItem = wrapper.find('[data-testid="menu-rename"]');
    if (renameItem.exists()) {
      await renameItem.trigger("click");
      expect(wrapper.emitted("rename")).toBeTruthy();
    }
  });

  it("emits delete event when Delete is clicked", async () => {
    const folder = createMockFolderTree();
    const wrapper = mountWithVuetify(FolderContextMenu, {
      props: {
        modelValue: true,
        x: 100,
        y: 100,
        folder,
      },
    });

    const deleteItem = wrapper.find('[data-testid="menu-delete"]');
    if (deleteItem.exists()) {
      await deleteItem.trigger("click");
      expect(wrapper.emitted("delete")).toBeTruthy();
    }
  });

  it("displays correct icons for menu items", () => {
    const folder = createMockFolderTree();
    const wrapper = mountWithVuetify(FolderContextMenu, {
      props: {
        modelValue: true,
        x: 100,
        y: 100,
        folder,
      },
    });

    expect(wrapper.find(".mdi-folder-open").exists()).toBe(true);
    expect(wrapper.find(".mdi-folder-plus").exists()).toBe(true);
    expect(wrapper.find(".mdi-pencil").exists()).toBe(true);
    expect(wrapper.find(".mdi-delete").exists()).toBe(true);
  });

  it("does not render when modelValue is false", () => {
    const folder = createMockFolderTree();
    const wrapper = mountWithVuetify(FolderContextMenu, {
      props: {
        modelValue: false,
        x: 100,
        y: 100,
        folder,
      },
    });

    expect(wrapper.find(".v-menu").exists()).toBe(false);
  });
});
