import { container } from "../../../container";

export const getAllFolders = () => {
  describe("Get all folders - FolderService - getAllFolders", () => {
    const service = container.getFolderService();

    it("should return all folders", async () => {
      const folders = await service.getAllFolders();

      expect(folders).toBeDefined();
      expect(Array.isArray(folders)).toBe(true);
      expect(folders.length).toBeGreaterThan(0);
    });

    it("should return folders with correct properties", async () => {
      const folders = await service.getAllFolders();

      folders.forEach((folder) => {
        expect(folder).toHaveProperty("id");
        expect(folder).toHaveProperty("name");
        expect(folder).toHaveProperty("path");
        expect(folder).toHaveProperty("createdAt");
        expect(folder).toHaveProperty("updatedAt");
      });
    });

    it("should include seeded folders", async () => {
      const folders = await service.getAllFolders();
      const folderNames = folders.map((f) => f.name);

      expect(folderNames).toContain("Root Folder 1");
      expect(folderNames).toContain("Root Folder 2");
      expect(folderNames).toContain("Child Folder 1");
    });
  });
};
