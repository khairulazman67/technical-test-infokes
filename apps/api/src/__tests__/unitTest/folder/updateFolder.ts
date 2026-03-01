import type { UpdateFolderDTO } from "@repo/types";
import { container } from "../../../container";
import { prisma } from "../../../database/prisma";

export const updateFolder = () => {
  describe("Update folder - FolderService - updateFolder", () => {
    const service = container.getFolderService();

    beforeEach(async () => {
      // Create a temporary folder for update tests
      await prisma.folder.create({
        data: {
          id: "test-update-1",
          name: "Old Name",
          path: "/Old Name",
          parentId: null,
        },
      });
    });

    afterEach(async () => {
      // Clean up
      await prisma.folder.deleteMany({
        where: {
          id: "test-update-1",
        },
      });
    });

    it("should update folder name", async () => {
      const dto: UpdateFolderDTO = { name: "New Name" };

      const folder = await service.updateFolder("test-update-1", dto);

      expect(folder.name).toBe("New Name");
      expect(folder.path).toBe("/New Name");
      expect(folder.id).toBe("test-update-1");
    });

    it("should throw error if folder not found", async () => {
      await expect(
        service.updateFolder("non-existent-id", { name: "New Name" }),
      ).rejects.toThrow("Folder not found");
    });

    it("should throw error if new path already exists", async () => {
      const dto: UpdateFolderDTO = { name: "Root Folder 2" };

      await expect(service.updateFolder("test-update-1", dto)).rejects.toThrow(
        "Folder with this path already exists",
      );
    });

    it("should update child folder paths when parent name changes", async () => {
      // Create parent and child
      const parent = await prisma.folder.create({
        data: {
          id: "test-update-parent",
          name: "Parent Old",
          path: "/Parent Old",
          parentId: null,
        },
      });

      const child = await prisma.folder.create({
        data: {
          id: "test-update-child",
          name: "Child",
          path: "/Parent Old/Child",
          parentId: parent.id,
        },
      });

      // Update parent name
      await service.updateFolder("test-update-parent", { name: "Parent New" });

      // Check child path was updated
      const updatedChild = await service.getFolderById("test-update-child");
      expect(updatedChild?.path).toBe("/Parent New/Child");

      // Clean up
      await prisma.folder.deleteMany({
        where: {
          id: {
            in: ["test-update-parent", "test-update-child"],
          },
        },
      });
    });
  });
};
