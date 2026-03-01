import { describe, expect, it } from "vitest";
import { createMockFolderTree, mountWithVuetify } from "../../test-utils";
import CustomTreeView from "../CustomTreeView.vue";

describe("CustomTreeView", () => {
  it("renders empty state when no items provided", () => {
    const wrapper = mountWithVuetify(CustomTreeView, {
      props: { items: [] },
    });

    expect(wrapper.text()).toContain("No folders");
  });

  it("renders list of folders", () => {
    const items = [
      createMockFolderTree({ id: "1", name: "Folder 1" }),
      createMockFolderTree({ id: "2", name: "Folder 2" }),
    ];
    const wrapper = mountWithVuetify(CustomTreeView, {
      props: { items },
    });

    expect(wrapper.text()).toContain("Folder 1");
    expect(wrapper.text()).toContain("Folder 2");
  });

  it("emits select event when folder is clicked", async () => {
    const folder = createMockFolderTree({ name: "Test Folder" });
    const wrapper = mountWithVuetify(CustomTreeView, {
      props: { items: [folder] },
    });

    // Find and click the folder
    const folderNode = wrapper.find(".tree-node-content");
    await folderNode.trigger("click");

    expect(wrapper.emitted("select")).toBeTruthy();
    expect(wrapper.emitted("select")?.[0]).toEqual([folder]);
  });

  it("renders nested folder structure", () => {
    const items = [
      createMockFolderTree({
        id: "1",
        name: "Parent",
        children: [
          createMockFolderTree({ id: "2", name: "Child 1" }),
          createMockFolderTree({ id: "3", name: "Child 2" }),
        ],
      }),
    ];
    const wrapper = mountWithVuetify(CustomTreeView, {
      props: { items },
    });

    expect(wrapper.text()).toContain("Parent");
  });

  it("passes selectedId to child nodes", () => {
    const items = [createMockFolderTree({ id: "1", name: "Folder 1" })];
    const wrapper = mountWithVuetify(CustomTreeView, {
      props: {
        items,
        selectedId: "1",
      },
    });

    const node = wrapper.findComponent({ name: "CustomTreeNode" });
    expect(node.props("selectedId")).toBe("1");
  });
});
