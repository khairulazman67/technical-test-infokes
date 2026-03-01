import { container } from "../../../container";
import { prisma } from "../../../database/prisma";

export const deleteFolder = () => {
  describe("Delete folder - FolderService - deleteFolder", () => {
    const service = container.getFolderService();

    beforeEach(async () => {
      // Create a temporary folder for deletion tests
      await prisma.folder.create({
        data: {
          id: "test-delete-1",
          name: "To Delete",
          path: "/To Delete",
          parentId: null,
        },
      });
    });

    afterEach(async () => {
      // Clean up if test failed
      await prisma.folder.deleteMany({
        where: {
          id: "test-delete-1",
        },
      });
    });

    it("should delete folder successfully", async () => {
      await service.deleteFolder("test-delete-1");

      const folder = await service.getFolderById("test-delete-1");
      expect(folder).toBeNull();
    });

    it("should throw error if folder not found", async () => {
      await expect(service.deleteFolder("non-existent-id")).rejects.toThrow(
        "Folder not found",
      );
    });

    it("should delete folder with children (cascade)", async () => {
      // Create parent and child
      const parent = await prisma.folder.create({
        data: {
          id: "test-delete-parent",
          name: "Parent To Delete",
          path: "/Parent To Delete",
          parentId: null,
        },
      });

      await prisma.folder.create({
        data: {
          id: "test-delete-child",
          name: "Child To Delete",
          path: "/Parent To Delete/Child To Delete",
          parentId: parent.id,
        },
      });

      // Delete parent
      await service.deleteFolder("test-delete-parent");

      // Both should be deleted
      const parentFolder = await service.getFolderById("test-delete-parent");
      const childFolder = await service.getFolderById("test-delete-child");

      expect(parentFolder).toBeNull();
      expect(childFolder).toBeNull();
    });
  });
};
