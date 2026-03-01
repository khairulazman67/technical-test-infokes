import { describe, expect, it } from "vitest";
import { createMockFolderTree, mountWithVuetify } from "../../test-utils";
import FolderList from "../FolderList.vue";

describe("FolderList", () => {
  it("renders breadcrumb navigation", () => {
    const breadcrumbs = [
      { id: "1", name: "Root", path: "/root" },
      { id: "2", name: "Subfolder", path: "/root/subfolder" },
    ];
    const wrapper = mountWithVuetify(FolderList, {
      props: {
        folders: [],
        breadcrumbs,
      },
    });

    expect(wrapper.text()).toContain("Root");
    expect(wrapper.text()).toContain("Subfolder");
  });

  it("displays folder list", () => {
    const folders = [
      createMockFolderTree({ id: "1", name: "Folder 1" }),
      createMockFolderTree({ id: "2", name: "Folder 2" }),
    ];
    const wrapper = mountWithVuetify(FolderList, {
      props: {
        folders,
        breadcrumbs: [],
      },
    });

    expect(wrapper.text()).toContain("Folder 1");
    expect(wrapper.text()).toContain("Folder 2");
  });

  it("shows empty state when no folders", () => {
    const wrapper = mountWithVuetify(FolderList, {
      props: {
        folders: [],
        breadcrumbs: [],
      },
    });

    expect(wrapper.text()).toContain("No subfolders");
  });

  it("emits select event when folder is clicked", async () => {
    const folder = createMockFolderTree({ name: "Test Folder" });
    const wrapper = mountWithVuetify(FolderList, {
      props: {
        folders: [folder],
        breadcrumbs: [],
      },
    });

    const folderItem = wrapper.find(".v-list-item");
    await folderItem.trigger("click");

    expect(wrapper.emitted("select")).toBeTruthy();
    expect(wrapper.emitted("select")?.[0]).toEqual([folder]);
  });

  it("emits contextmenu event on right click", async () => {
    const folder = createMockFolderTree({ name: "Test Folder" });
    const wrapper = mountWithVuetify(FolderList, {
      props: {
        folders: [folder],
        breadcrumbs: [],
      },
    });

    const folderItem = wrapper.find(".v-list-item");
    await folderItem.trigger("contextmenu");

    expect(wrapper.emitted("contextmenu")).toBeTruthy();
  });

  it("emits breadcrumb-click when breadcrumb is clicked", async () => {
    const breadcrumbs = [
      { id: "1", name: "Root", path: "/root" },
      { id: "2", name: "Subfolder", path: "/root/subfolder" },
    ];
    const wrapper = mountWithVuetify(FolderList, {
      props: {
        folders: [],
        breadcrumbs,
      },
    });

    const breadcrumbLink = wrapper.find(".v-breadcrumbs a");
    await breadcrumbLink.trigger("click");

    expect(wrapper.emitted("breadcrumb-click")).toBeTruthy();
  });

  it("displays folder icon for each folder", () => {
    const folders = [createMockFolderTree({ name: "Test Folder" })];
    const wrapper = mountWithVuetify(FolderList, {
      props: {
        folders,
        breadcrumbs: [],
      },
    });

    const icon = wrapper.find(".mdi-folder");
    expect(icon.exists()).toBe(true);
  });

  it("shows selected folder with highlight", () => {
    const folder = createMockFolderTree({ id: "1", name: "Selected" });
    const wrapper = mountWithVuetify(FolderList, {
      props: {
        folders: [folder],
        breadcrumbs: [],
        selectedFolder: folder,
      },
    });

    const listItem = wrapper.find(".v-list-item");
    expect(listItem.classes()).toContain("v-list-item--active");
  });
});
