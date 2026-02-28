import type { CreateFolderDTO, UpdateFolderDTO } from "@repo/types";
import { FolderService } from "../services/folder.service";

export class FolderController {
  private folderService: FolderService;

  constructor(folderService: FolderService) {
    this.folderService = folderService;
  }

  async getAllFolders() {
    try {
      const folders = await this.folderService.getAllFolders();
      return {
        success: true,
        data: folders,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getFolderTree() {
    try {
      const tree = await this.folderService.getFolderTree();
      return {
        success: true,
        data: tree,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getFolderById(id: string) {
    try {
      const folder = await this.folderService.getFolderById(id);
      if (!folder) {
        return {
          success: false,
          error: "Folder not found",
        };
      }
      return {
        success: true,
        data: folder,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getFoldersByParentId(parentId: string | null) {
    try {
      const folders = await this.folderService.getFoldersByParentId(parentId);
      return {
        success: true,
        data: folders,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async searchFolders(query: string) {
    try {
      const folders = await this.folderService.searchFolders(query);
      return {
        success: true,
        data: folders,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async createFolder(data: CreateFolderDTO) {
    try {
      const folder = await this.folderService.createFolder(data);
      return {
        success: true,
        data: folder,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async updateFolder(id: string, data: UpdateFolderDTO) {
    try {
      const folder = await this.folderService.updateFolder(id, data);
      return {
        success: true,
        data: folder,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async deleteFolder(id: string) {
    try {
      await this.folderService.deleteFolder(id);
      return {
        success: true,
        message: "Folder deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
