import { container } from "../../../container";

export const getFolderTree = () => {
  describe("Get folder tree - FolderService - getFolderTree", () => {
    const service = container.getFolderService();

    it("should return folder tree structure", async () => {
      const tree = await service.getFolderTree();

      expect(tree).toBeDefined();
      expect(Array.isArray(tree)).toBe(true);
      expect(tree.length).toBeGreaterThan(0);
    });

    it("should have root folders with children", async () => {
      const tree = await service.getFolderTree();

      const rootFolder1 = tree.find((f) => f.id === "test-root-1");
      expect(rootFolder1).toBeDefined();
      expect(rootFolder1?.children).toBeDefined();
      expect(rootFolder1?.children?.length).toBeGreaterThan(0);
    });

    it("should have nested structure", async () => {
      const tree = await service.getFolderTree();

      const rootFolder1 = tree.find((f) => f.id === "test-root-1");
      const childFolder1 = rootFolder1?.children?.find(
        (f) => f.id === "test-child-1",
      );

      expect(childFolder1).toBeDefined();
      expect(childFolder1?.children).toBeDefined();
      expect(childFolder1?.children?.length).toBeGreaterThan(0);
    });

    it("should handle multiple root folders", async () => {
      const tree = await service.getFolderTree();

      const rootFolders = tree.filter((f) => f.id.startsWith("test-root-"));
      expect(rootFolders.length).toBeGreaterThanOrEqual(2);
    });

    it("should have correct tree properties", async () => {
      const tree = await service.getFolderTree();

      tree.forEach((folder) => {
        expect(folder).toHaveProperty("id");
        expect(folder).toHaveProperty("name");
        expect(folder).toHaveProperty("path");
        expect(folder).toHaveProperty("children");
      });
    });
  });
};
