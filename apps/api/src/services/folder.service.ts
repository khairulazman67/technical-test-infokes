import type {
  CreateFolderDTO,
  Folder as FolderDTO,
  FolderTreeDTO,
  UpdateFolderDTO,
} from "@repo/types";
import { prisma } from "../database/prisma";
import { FolderMapper } from "../mappers/folder.mapper";
import { FolderRepository } from "../repositories/folder.repository";

export class FolderService {
  private folderRepository: FolderRepository;
  constructor(folderRepository: FolderRepository) {
    this.folderRepository = folderRepository;
  }

  async getAllFolders(): Promise<FolderDTO[]> {
    const folders = await this.folderRepository.findAll();
    return FolderMapper.toDTOArray(folders);
  }

  async getFolderTree(): Promise<FolderTreeDTO[]> {
    const allFolders = await this.folderRepository.findAll();
    return FolderMapper.buildTree(allFolders);
  }

  async getFolderById(id: string): Promise<FolderDTO | null> {
    const folder = await this.folderRepository.findById(id);
    return folder ? FolderMapper.toDTO(folder) : null;
  }

  async getFoldersByParentId(parentId: string | null): Promise<FolderDTO[]> {
    const folders = await this.folderRepository.findByParentId(parentId);
    return FolderMapper.toDTOArray(folders);
  }

  async searchFolders(query: string): Promise<FolderDTO[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const folders = await this.folderRepository.search(query.trim());
    return FolderMapper.toDTOArray(folders);
  }

  async createFolder(data: CreateFolderDTO): Promise<FolderDTO> {
    // Use transaction to ensure atomicity
    return await prisma.$transaction(async (tx) => {
      const txRepo = new FolderRepository(tx);

      // Validate parent exists if parentId provided
      if (data.parentId) {
        const parentExists = await txRepo.exists(data.parentId);
        if (!parentExists) {
          throw new Error("Parent folder not found");
        }
      }

      // Generate path
      const path = await this.generatePathInTransaction(
        txRepo,
        data.name,
        data.parentId,
      );

      // Check if path already exists
      const pathExists = await txRepo.pathExists(path);
      if (pathExists) {
        throw new Error("Folder with this path already exists");
      }

      // Create folder
      const folder = await txRepo.create({
        name: data.name,
        path,
        parentId: data.parentId,
      });

      return FolderMapper.toDTO(folder);
    });
  }

  async updateFolder(id: string, data: UpdateFolderDTO): Promise<FolderDTO> {
    // Use transaction for atomic updates
    return await prisma.$transaction(async (tx) => {
      const txRepo = new FolderRepository(tx);

      const folder = await txRepo.findById(id);
      if (!folder) {
        throw new Error("Folder not found");
      }

      // If name is being updated, update path
      let newPath = folder.path;
      if (data.name && data.name !== folder.name) {
        newPath = await this.generatePathInTransaction(
          txRepo,
          data.name,
          folder.parentId,
        );

        // Check if new path already exists
        const pathExists = await txRepo.pathExists(newPath);
        if (pathExists) {
          throw new Error("Folder with this path already exists");
        }

        // Update paths of all childre
        await this.updateChildrenPathsInTransaction(
          txRepo,
          folder.path,
          newPath,
        );
      }

      // Update folder
      const updatedFolder = await txRepo.update(id, {
        name: data.name,
        path: newPath,
        parentId: data.parentId,
      });

      return FolderMapper.toDTO(updatedFolder);
    });
  }

  async deleteFolder(id: string): Promise<void> {
    const folder = await this.folderRepository.findById(id);
    if (!folder) {
      throw new Error("Folder not found");
    }

    // Delete folder (cascade will handle children)
    await this.folderRepository.delete(id);
  }

  private async generatePathInTransaction(
    txRepo: FolderRepository,
    name: string,
    parentId?: string | null,
  ): Promise<string> {
    if (!parentId) {
      return `/${name}`;
    }

    const parent = await txRepo.findById(parentId);
    if (!parent) {
      throw new Error("Parent folder not found");
    }

    return `${parent.path}/${name}`;
  }

  private async updateChildrenPathsInTransaction(
    txRepo: FolderRepository,
    oldParentPath: string,
    newParentPath: string,
  ): Promise<void> {
    // Find all children that need path updates
    const allFolders = await txRepo.findAll();
    const childrenToUpdate = allFolders.filter((f) =>
      f.path.startsWith(oldParentPath + "/"),
    );

    // Update all children paths in transaction
    for (const child of childrenToUpdate) {
      const newPath = child.path.replace(oldParentPath, newParentPath);
      await txRepo.update(child.id, { path: newPath });
    }
  }
}
