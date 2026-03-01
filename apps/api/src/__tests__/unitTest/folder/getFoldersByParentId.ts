import { container } from "../../../container";

export const getFoldersByParentId = () => {
  describe("Get folders by parent ID - FolderService - getFoldersByParentId", () => {
    const service = container.getFolderService();

    it("should return folders by parent id", async () => {
      const folders = await service.getFoldersByParentId("test-root-1");

      expect(folders).toBeDefined();
      expect(Array.isArray(folders)).toBe(true);
      expect(folders.length).toBeGreaterThan(0);
      expect(folders.every((f) => f.parentId === "test-root-1")).toBe(true);
    });

    it("should return root folders when parentId is null", async () => {
      const folders = await service.getFoldersByParentId(null);

      expect(folders).toBeDefined();
      expect(Array.isArray(folders)).toBe(true);
      expect(folders.length).toBeGreaterThan(0);
      expect(folders.every((f) => f.parentId === null)).toBe(true);
    });

    it("should return empty array when no children exist", async () => {
      const folders = await service.getFoldersByParentId("test-nested-1");

      expect(folders).toEqual([]);
    });

    it("should return correct children for specific parent", async () => {
      const folders = await service.getFoldersByParentId("test-root-1");
      const folderNames = folders.map((f) => f.name);

      expect(folderNames).toContain("Child Folder 1");
      expect(folderNames).toContain("Child Folder 2");
    });
  });
};
