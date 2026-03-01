import type { CreateFolderDTO } from "@repo/types";
import { container } from "../../../container";
import { prisma } from "../../../database/prisma";

export const createFolder = () => {
  describe("Create new folder - FolderService - createFolder", () => {
    const service = container.getFolderService();

    afterEach(async () => {
      // Clean up folders created during tests
      await prisma.folder.deleteMany({
        where: {
          name: {
            in: [
              "New Root Folder",
              "New Child Folder",
              "Folder-with_special.chars",
            ],
          },
        },
      });
    });

    it("should create a root folder", async () => {
      const dto: CreateFolderDTO = {
        name: "New Root Folder",
        parentId: undefined,
      };

      const folder = await service.createFolder(dto);

      expect(folder).toBeDefined();
      expect(folder.name).toBe("New Root Folder");
      expect(folder.path).toBe("/New Root Folder");
      expect(folder.parentId).toBeNull();
      expect(folder.id).toBeDefined();
    });

    it("should create a child folder", async () => {
      const dto: CreateFolderDTO = {
        name: "New Child Folder",
        parentId: "test-root-1",
      };

      const folder = await service.createFolder(dto);

      expect(folder).toBeDefined();
      expect(folder.name).toBe("New Child Folder");
      expect(folder.path).toBe("/Root Folder 1/New Child Folder");
      expect(folder.parentId).toBe("test-root-1");
    });

    it("should throw error if parent not found", async () => {
      const dto: CreateFolderDTO = {
        name: "Test",
        parentId: "non-existent-id",
      };

      await expect(service.createFolder(dto)).rejects.toThrow(
        "Parent folder not found",
      );
    });

    it("should throw error if path already exists", async () => {
      const dto: CreateFolderDTO = {
        name: "Root Folder 1",
        parentId: undefined,
      };

      await expect(service.createFolder(dto)).rejects.toThrow(
        "Folder with this path already exists",
      );
    });

    it("should create folder with special characters in name", async () => {
      const dto: CreateFolderDTO = {
        name: "Folder-with_special.chars",
        parentId: undefined,
      };

      const folder = await service.createFolder(dto);

      expect(folder.name).toBe("Folder-with_special.chars");
      expect(folder.path).toBe("/Folder-with_special.chars");
    });
  });
};
