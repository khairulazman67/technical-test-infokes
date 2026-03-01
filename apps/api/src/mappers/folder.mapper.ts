import type { Folder as PrismaFolder } from "@prisma/client";
import type { Folder as FolderDTO, FolderTreeDTO } from "@repo/types";

/**
 * Folder Mapper
 * Converts between Prisma entities and DTOs
 */
export class FolderMapper {
  /**
   * Convert Prisma Folder entity to FolderDTO
   */
  static toDTO(folder: PrismaFolder): FolderDTO {
    return {
      id: folder.id,
      name: folder.name,
      path: folder.path,
      parentId: folder.parentId,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
    };
  }

  /**
   * Convert array of Prisma Folder entities to FolderDTO array
   */
  static toDTOArray(folders: PrismaFolder[]): FolderDTO[] {
    return folders.map(this.toDTO);
  }

  /**
   * Build tree structure from flat array of folders
   */
  static buildTree(folders: PrismaFolder[]): FolderTreeDTO[] {
    const folderMap = new Map<string, FolderTreeDTO>();
    const rootFolders: FolderTreeDTO[] = [];

    // Create map of all folders
    folders.forEach((folder) => {
      folderMap.set(folder.id, {
        id: folder.id,
        name: folder.name,
        path: folder.path,
        children: [],
      });
    });

    // Build tree structure
    folders.forEach((folder) => {
      const node = folderMap.get(folder.id)!;

      if (folder.parentId) {
        const parent = folderMap.get(folder.parentId);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(node);
        }
      } else {
        rootFolders.push(node);
      }
    });

    return rootFolders;
  }

  /**
   * Convert Prisma Folder to FolderTreeDTO (single node)
   */
  static toTreeDTO(folder: PrismaFolder): FolderTreeDTO {
    return {
      id: folder.id,
      name: folder.name,
      path: folder.path,
      children: [],
    };
  }
}
