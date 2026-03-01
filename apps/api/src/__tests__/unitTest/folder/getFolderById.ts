import { container } from "../../../container";

export const getFolderById = () => {
  describe("Get folder by ID - FolderService - getFolderById", () => {
    const service = container.getFolderService();

    it("should return folder by id", async () => {
      const folder = await service.getFolderById("test-root-1");

      expect(folder).toBeDefined();
      expect(folder?.id).toBe("test-root-1");
      expect(folder?.name).toBe("Root Folder 1");
      expect(folder?.path).toBe("/Root Folder 1");
    });

    it("should return null if folder not found", async () => {
      const folder = await service.getFolderById("non-existent-id");

      expect(folder).toBeNull();
    });

    it("should return folder with all properties", async () => {
      const folder = await service.getFolderById("test-child-1");

      expect(folder).toBeDefined();
      expect(folder?.id).toBe("test-child-1");
      expect(folder?.name).toBe("Child Folder 1");
      expect(folder?.path).toBe("/Root Folder 1/Child Folder 1");
      expect(folder?.parentId).toBe("test-root-1");
      expect(folder?.createdAt).toBeDefined();
      expect(folder?.updatedAt).toBeDefined();
    });
  });
};
