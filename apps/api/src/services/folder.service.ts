import type { Folder } from "@prisma/client";
import type {
  CreateFolderDTO,
  Folder as FolderDTO,
  FolderTreeDTO,
  UpdateFolderDTO,
} from "@repo/types";
import { FolderRepository } from "../repositories/folder.repository";

export class FolderService {
  private folderRepository: FolderRepository;

  constructor(folderRepository: FolderRepository) {
    this.folderRepository = folderRepository;
  }

  async getAllFolders(): Promise<FolderDTO[]> {
    const folders = await this.folderRepository.findAll();
    return folders.map(this.toDTO);
  }

  async getFolderTree(): Promise<FolderTreeDTO[]> {
    const allFolders = await this.folderRepository.findAll();
    return this.buildTree(allFolders);
  }

  async getFolderById(id: string): Promise<FolderDTO | null> {
    const folder = await this.folderRepository.findById(id);
    return folder ? this.toDTO(folder) : null;
  }

  async getFoldersByParentId(parentId: string | null): Promise<FolderDTO[]> {
    const folders = await this.folderRepository.findByParentId(parentId);
    return folders.map(this.toDTO);
  }

  async searchFolders(query: string): Promise<FolderDTO[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const folders = await this.folderRepository.search(query.trim());
    return folders.map(this.toDTO);
  }

  async createFolder(data: CreateFolderDTO): Promise<FolderDTO> {
    // Validate parent exists if parentId provided
    if (data.parentId) {
      const parentExists = await this.folderRepository.exists(data.parentId);
      if (!parentExists) {
        throw new Error("Parent folder not found");
      }
    }

    // Generate path
    const path = await this.generatePath(data.name, data.parentId);

    // Check if path already exists
    const pathExists = await this.folderRepository.pathExists(path);
    if (pathExists) {
      throw new Error("Folder with this path already exists");
    }

    const folder = await this.folderRepository.create({
      name: data.name,
      path,
      parentId: data.parentId,
    });

    return this.toDTO(folder);
  }

  async updateFolder(id: string, data: UpdateFolderDTO): Promise<FolderDTO> {
    const folder = await this.folderRepository.findById(id);
    if (!folder) {
      throw new Error("Folder not found");
    }

    // If name is being updated, update path
    let newPath = folder.path;
    if (data.name && data.name !== folder.name) {
      newPath = await this.generatePath(data.name, folder.parentId);

      // Check if new path already exists
      const pathExists = await this.folderRepository.pathExists(newPath);
      if (pathExists) {
        throw new Error("Folder with this path already exists");
      }

      // Update paths of all children
      await this.updateChildrenPaths(folder.path, newPath);
    }

    const updatedFolder = await this.folderRepository.update(id, {
      name: data.name,
      path: newPath,
      parentId: data.parentId,
    });

    return this.toDTO(updatedFolder);
  }

  async deleteFolder(id: string): Promise<void> {
    const folder = await this.folderRepository.findById(id);
    if (!folder) {
      throw new Error("Folder not found");
    }

    // Delete folder (cascade will handle children)
    await this.folderRepository.delete(id);
  }

  private async generatePath(name: string, parentId?: string): Promise<string> {
    if (!parentId) {
      return `/${name}`;
    }

    const parent = await this.folderRepository.findById(parentId);
    if (!parent) {
      throw new Error("Parent folder not found");
    }

    return `${parent.path}/${name}`;
  }

  private async updateChildrenPaths(
    oldParentPath: string,
    newParentPath: string,
  ): Promise<void> {
    const allFolders = await this.folderRepository.findAll();
    const childrenToUpdate = allFolders.filter((f) =>
      f.path.startsWith(oldParentPath + "/"),
    );

    for (const child of childrenToUpdate) {
      const newPath = child.path.replace(oldParentPath, newParentPath);
      await this.folderRepository.update(child.id, { path: newPath });
    }
  }

  private buildTree(folders: Folder[]): FolderTreeDTO[] {
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

  private toDTO(folder: Folder): FolderDTO {
    return {
      id: folder.id,
      name: folder.name,
      path: folder.path,
      parentId: folder.parentId,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
    };
  }
}
