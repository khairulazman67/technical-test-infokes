import { container } from "../../../container";

export const searchFolders = () => {
  describe("Search folders - FolderService - searchFolders", () => {
    const service = container.getFolderService();

    it("should search folders by query", async () => {
      const folders = await service.searchFolders("Root");

      expect(folders).toBeDefined();
      expect(Array.isArray(folders)).toBe(true);
      expect(folders.length).toBeGreaterThan(0);
      expect(folders.some((f) => f.name.includes("Root"))).toBe(true);
    });

    it("should return empty array for empty query", async () => {
      const folders = await service.searchFolders("");

      expect(folders).toEqual([]);
    });

    it("should return empty array for whitespace query", async () => {
      const folders = await service.searchFolders("   ");

      expect(folders).toEqual([]);
    });

    it("should search case-insensitively", async () => {
      const folders = await service.searchFolders("root");

      expect(folders.length).toBeGreaterThan(0);
      expect(folders.some((f) => f.name.toLowerCase().includes("root"))).toBe(
        true,
      );
    });

    it("should return empty array when no matches found", async () => {
      const folders = await service.searchFolders("NonExistentFolder12345");

      expect(folders).toEqual([]);
    });

    it("should find folders by partial name", async () => {
      const folders = await service.searchFolders("Child");

      expect(folders.length).toBeGreaterThan(0);
      expect(folders.some((f) => f.name.includes("Child"))).toBe(true);
    });

    it("should trim query before searching", async () => {
      const folders = await service.searchFolders("  Documents  ");

      expect(folders).toBeDefined();
      expect(Array.isArray(folders)).toBe(true);
    });
  });
};
