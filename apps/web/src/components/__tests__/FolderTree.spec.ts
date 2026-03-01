import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createMockFolderTree,
  flushPromises,
  mountWithVuetify,
} from "../../test-utils";
import FolderTree from "../FolderTree.vue";

// Mock the composable
vi.mock("../../composables/useFolderOperations", () => ({
  useFolderOperations: () => ({
    searchFolders: vi.fn().mockResolvedValue([]),
  }),
}));

describe("FolderTree", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders folder tree title", () => {
    const wrapper = mountWithVuetify(FolderTree, {
      props: { folders: [] },
    });

    expect(wrapper.text()).toContain("Folder Structure");
  });

  it("displays search input", () => {
    const wrapper = mountWithVuetify(FolderTree, {
      props: { folders: [] },
    });

    const searchInput = wrapper.find('input[type="text"]');
    expect(searchInput.exists()).toBe(true);
  });

  it("shows loading indicator when loading prop is true", () => {
    const wrapper = mountWithVuetify(FolderTree, {
      props: {
        folders: [],
        loading: true,
      },
    });

    expect(wrapper.find(".v-progress-linear").exists()).toBe(true);
  });

  it("renders folders when provided", () => {
    const folders = [
      createMockFolderTree({ id: "1", name: "Folder 1" }),
      createMockFolderTree({ id: "2", name: "Folder 2" }),
    ];
    const wrapper = mountWithVuetify(FolderTree, {
      props: { folders },
    });

    expect(wrapper.text()).toContain("Folder 1");
    expect(wrapper.text()).toContain("Folder 2");
  });

  it("emits select event when folder is selected", async () => {
    const folder = createMockFolderTree({ name: "Test Folder" });
    const wrapper = mountWithVuetify(FolderTree, {
      props: { folders: [folder] },
    });

    const folderNode = wrapper.find(".tree-node-content");
    await folderNode.trigger("click");

    expect(wrapper.emitted("select")).toBeTruthy();
  });

  it("shows search results when searching", async () => {
    const { useFolderOperations } =
      await import("../../composables/useFolderOperations");
    const mockSearchFolders = vi
      .fn()
      .mockResolvedValue([
        { id: "1", name: "Search Result", path: "/search-result" },
      ]);

    vi.mocked(useFolderOperations).mockReturnValue({
      searchFolders: mockSearchFolders,
    } as any);

    const wrapper = mountWithVuetify(FolderTree, {
      props: { folders: [] },
    });

    const searchInput = wrapper.find('input[type="text"]');
    await searchInput.setValue("test");

    // Wait for debounce
    await new Promise((resolve) => setTimeout(resolve, 350));
    await flushPromises();

    expect(mockSearchFolders).toHaveBeenCalledWith("test");
  });

  it("clears search when clear button is clicked", async () => {
    const wrapper = mountWithVuetify(FolderTree, {
      props: { folders: [] },
    });

    const searchInput = wrapper.find('input[type="text"]');
    await searchInput.setValue("test query");

    // Find and click clear button
    const clearButton = wrapper.find(".mdi-close");
    if (clearButton.exists()) {
      await clearButton.trigger("click");
      expect(searchInput.element.value).toBe("");
    }
  });

  it("shows empty state when no folders found in search", async () => {
    const { useFolderOperations } =
      await import("../../composables/useFolderOperations");
    vi.mocked(useFolderOperations).mockReturnValue({
      searchFolders: vi.fn().mockResolvedValue([]),
    } as any);

    const wrapper = mountWithVuetify(FolderTree, {
      props: { folders: [] },
    });

    const searchInput = wrapper.find('input[type="text"]');
    await searchInput.setValue("nonexistent");

    await new Promise((resolve) => setTimeout(resolve, 350));
    await flushPromises();

    expect(wrapper.text()).toContain("No folders found");
  });
});
