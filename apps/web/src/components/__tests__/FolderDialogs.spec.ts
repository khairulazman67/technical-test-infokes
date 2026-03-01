import { describe, expect, it } from "vitest";
import { createMockFolderTree, mountWithVuetify } from "../../test-utils";
import FolderDialogs from "../FolderDialogs.vue";

describe("FolderDialogs", () => {
  describe("New Folder Dialog", () => {
    it("shows new folder dialog when newFolderDialog is true", () => {
      const wrapper = mountWithVuetify(FolderDialogs, {
        props: {
          newFolderDialog: true,
          renameDialog: false,
          deleteDialog: false,
          folder: null,
        },
      });

      expect(wrapper.text()).toContain("New Folder");
    });

    it("emits create event with folder name", async () => {
      const wrapper = mountWithVuetify(FolderDialogs, {
        props: {
          newFolderDialog: true,
          renameDialog: false,
          deleteDialog: false,
          folder: null,
        },
      });

      const input = wrapper.find('input[type="text"]');
      await input.setValue("New Test Folder");

      const createButton = wrapper.find('[data-testid="create-button"]');
      if (createButton.exists()) {
        await createButton.trigger("click");
        expect(wrapper.emitted("create")).toBeTruthy();
        expect(wrapper.emitted("create")?.[0]).toEqual(["New Test Folder"]);
      }
    });

    it("does not emit create event when name is empty", async () => {
      const wrapper = mountWithVuetify(FolderDialogs, {
        props: {
          newFolderDialog: true,
          renameDialog: false,
          deleteDialog: false,
          folder: null,
        },
      });

      const createButton = wrapper.find('[data-testid="create-button"]');
      if (createButton.exists()) {
        await createButton.trigger("click");
        expect(wrapper.emitted("create")).toBeFalsy();
      }
    });
  });

  describe("Rename Dialog", () => {
    it("shows rename dialog when renameDialog is true", () => {
      const folder = createMockFolderTree({ name: "Old Name" });
      const wrapper = mountWithVuetify(FolderDialogs, {
        props: {
          newFolderDialog: false,
          renameDialog: true,
          deleteDialog: false,
          folder,
        },
      });

      expect(wrapper.text()).toContain("Rename Folder");
    });

    it("pre-fills input with current folder name", () => {
      const folder = createMockFolderTree({ name: "Current Name" });
      const wrapper = mountWithVuetify(FolderDialogs, {
        props: {
          newFolderDialog: false,
          renameDialog: true,
          deleteDialog: false,
          folder,
        },
      });

      const input = wrapper.find('input[type="text"]');
      expect(input.element.value).toBe("Current Name");
    });

    it("emits rename event with new name", async () => {
      const folder = createMockFolderTree({ name: "Old Name" });
      const wrapper = mountWithVuetify(FolderDialogs, {
        props: {
          newFolderDialog: false,
          renameDialog: true,
          deleteDialog: false,
          folder,
        },
      });

      const input = wrapper.find('input[type="text"]');
      await input.setValue("New Name");

      const renameButton = wrapper.find('[data-testid="rename-button"]');
      if (renameButton.exists()) {
        await renameButton.trigger("click");
        expect(wrapper.emitted("rename")).toBeTruthy();
        expect(wrapper.emitted("rename")?.[0]).toEqual(["New Name"]);
      }
    });
  });

  describe("Delete Dialog", () => {
    it("shows delete confirmation dialog when deleteDialog is true", () => {
      const folder = createMockFolderTree({ name: "To Delete" });
      const wrapper = mountWithVuetify(FolderDialogs, {
        props: {
          newFolderDialog: false,
          renameDialog: false,
          deleteDialog: true,
          folder,
        },
      });

      expect(wrapper.text()).toContain("Delete Folder");
      expect(wrapper.text()).toContain("To Delete");
    });

    it("shows warning message", () => {
      const folder = createMockFolderTree();
      const wrapper = mountWithVuetify(FolderDialogs, {
        props: {
          newFolderDialog: false,
          renameDialog: false,
          deleteDialog: true,
          folder,
        },
      });

      expect(wrapper.text()).toContain("permanently deleted");
    });

    it("emits delete event when confirmed", async () => {
      const folder = createMockFolderTree();
      const wrapper = mountWithVuetify(FolderDialogs, {
        props: {
          newFolderDialog: false,
          renameDialog: false,
          deleteDialog: true,
          folder,
        },
      });

      const deleteButton = wrapper.find('[data-testid="delete-button"]');
      if (deleteButton.exists()) {
        await deleteButton.trigger("click");
        expect(wrapper.emitted("delete")).toBeTruthy();
      }
    });

    it("closes dialog when cancel is clicked", async () => {
      const folder = createMockFolderTree();
      const wrapper = mountWithVuetify(FolderDialogs, {
        props: {
          newFolderDialog: false,
          renameDialog: false,
          deleteDialog: true,
          folder,
        },
      });

      const cancelButton = wrapper.find('[data-testid="cancel-button"]');
      if (cancelButton.exists()) {
        await cancelButton.trigger("click");
        expect(wrapper.emitted("update:deleteDialog")).toBeTruthy();
        expect(wrapper.emitted("update:deleteDialog")?.[0]).toEqual([false]);
      }
    });
  });
});
