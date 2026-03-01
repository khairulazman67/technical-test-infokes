import { describe, expect, it } from "vitest";
import { createMockFolderTree, mountWithVuetify } from "../../test-utils";
import CustomTreeNode from "../CustomTreeNode.vue";

describe("CustomTreeNode", () => {
  it("renders folder name correctly", () => {
    const folder = createMockFolderTree({ name: "My Folder" });
    const wrapper = mountWithVuetify(CustomTreeNode, {
      props: { item: folder },
    });

    expect(wrapper.text()).toContain("My Folder");
  });

  it("displays folder icon", () => {
    const folder = createMockFolderTree();
    const wrapper = mountWithVuetify(CustomTreeNode, {
      props: { item: folder },
    });

    const icon = wrapper.find(".mdi-folder");
    expect(icon.exists()).toBe(true);
  });

  it("emits select event when clicked", async () => {
    const folder = createMockFolderTree();
    const wrapper = mountWithVuetify(CustomTreeNode, {
      props: { item: folder },
    });

    await wrapper.find(".tree-node-content").trigger("click");

    expect(wrapper.emitted("select")).toBeTruthy();
    expect(wrapper.emitted("select")?.[0]).toEqual([folder]);
  });

  it("shows expand icon when folder has children", () => {
    const folder = createMockFolderTree({
      children: [createMockFolderTree({ id: "2", name: "Child" })],
    });
    const wrapper = mountWithVuetify(CustomTreeNode, {
      props: { item: folder },
    });

    const expandIcon = wrapper.find(".mdi-chevron-right");
    expect(expandIcon.exists()).toBe(true);
  });

  it("does not show expand icon when folder has no children", () => {
    const folder = createMockFolderTree({ children: [] });
    const wrapper = mountWithVuetify(CustomTreeNode, {
      props: { item: folder },
    });

    const expandIcon = wrapper.find(".mdi-chevron-right");
    expect(expandIcon.exists()).toBe(false);
  });

  it("toggles expanded state when expand icon is clicked", async () => {
    const folder = createMockFolderTree({
      children: [createMockFolderTree({ id: "2", name: "Child" })],
    });
    const wrapper = mountWithVuetify(CustomTreeNode, {
      props: { item: folder },
    });

    const expandIcon = wrapper.find(".mdi-chevron-right");
    await expandIcon.trigger("click");

    // Should show children after expand
    expect(wrapper.find(".tree-node-children").exists()).toBe(true);
  });

  it("renders nested children correctly", () => {
    const folder = createMockFolderTree({
      name: "Parent",
      children: [
        createMockFolderTree({ id: "2", name: "Child 1" }),
        createMockFolderTree({ id: "3", name: "Child 2" }),
      ],
    });
    const wrapper = mountWithVuetify(CustomTreeNode, {
      props: { item: folder },
    });

    // Expand to show children
    const expandIcon = wrapper.find(".mdi-chevron-right");
    expandIcon.trigger("click");

    // Wait for next tick
    wrapper.vm.$nextTick(() => {
      expect(wrapper.text()).toContain("Child 1");
      expect(wrapper.text()).toContain("Child 2");
    });
  });

  it("applies active class when selected", () => {
    const folder = createMockFolderTree();
    const wrapper = mountWithVuetify(CustomTreeNode, {
      props: {
        item: folder,
        selectedId: folder.id,
      },
    });

    const content = wrapper.find(".tree-node-content");
    expect(content.classes()).toContain("active");
  });

  it("does not apply active class when not selected", () => {
    const folder = createMockFolderTree({ id: "1" });
    const wrapper = mountWithVuetify(CustomTreeNode, {
      props: {
        item: folder,
        selectedId: "2",
      },
    });

    const content = wrapper.find(".tree-node-content");
    expect(content.classes()).not.toContain("active");
  });
});
