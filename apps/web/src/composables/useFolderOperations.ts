import { ref } from "vue";
import { folderApi } from "../services/api";
import type { Folder, FolderOrTree, FolderTreeDTO } from "../types/folder";

export function useFolderOperations() {
  const contextMenuFolder = ref<FolderOrTree | null>(null);

  // Find folder by path (works with both Folder and FolderTreeDTO)
  const findFolderByPath = (
    items: FolderOrTree[],
    path: string,
  ): FolderOrTree | null => {
    for (const item of items) {
      if (item.path === path) return item;
      if (item.children) {
        const found = findFolderByPath(item.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  // Generate breadcrumbs (works with both Folder and FolderTreeDTO)
  const generateBreadcrumbs = (
    folder: FolderOrTree | null,
    allFolders: FolderOrTree[],
  ): Array<{ text: string; folder: FolderOrTree | null }> => {
    if (!folder) return [];

    const crumbs: Array<{
      text: string;
      folder: FolderOrTree | null;
    }> = [{ text: "Root", folder: null }];

    const path = folder.path.split("/").filter((p) => p);
    let currentPath = "";

    for (const segment of path) {
      currentPath += "/" + segment;
      const foundFolder = findFolderByPath(allFolders, currentPath);
      if (foundFolder) {
        crumbs.push({ text: foundFolder.name, folder: foundFolder });
      }
    }

    return crumbs;
  };

  // Rename folder
  const renameFolder = async (
    folderId: string,
    newName: string,
  ): Promise<Folder> => {
    return await folderApi.update(folderId, { name: newName });
  };

  // Delete folder
  const deleteFolder = async (folderId: string): Promise<void> => {
    await folderApi.delete(folderId);
  };

  // Create new folder
  const createNewFolder = async (
    parentId: string | null,
    name: string,
  ): Promise<Folder> => {
    return await folderApi.create({ name, parentId: parentId || undefined });
  };

  // Fetch folder tree
  const fetchFolderTree = async (): Promise<FolderTreeDTO[]> => {
    return await folderApi.getTree();
  };

  // Get folder by ID
  const getFolderById = async (folderId: string): Promise<Folder> => {
    return await folderApi.getById(folderId);
  };

  // Search folders
  const searchFolders = async (query: string): Promise<Folder[]> => {
    return await folderApi.search(query);
  };

  return {
    contextMenuFolder,
    findFolderByPath,
    generateBreadcrumbs,
    renameFolder,
    deleteFolder,
    createNewFolder,
    fetchFolderTree,
    getFolderById,
    searchFolders,
  };
}
