import { ref } from "vue";
import { folderApi } from "../services/api";
import type { Folder } from "../types/folder";

export function useFolderOperations() {
  const contextMenuFolder = ref<Folder | null>(null);

  // Find folder by path
  const findFolderByPath = (items: Folder[], path: string): Folder | null => {
    for (const item of items) {
      if (item.path === path) return item;
      if (item.children) {
        const found = findFolderByPath(item.children, path);
        if (found) return found;
      }
    }
    return null;
  };

  // Generate breadcrumbs
  const generateBreadcrumbs = (
    folder: Folder | null,
    allFolders: Folder[],
  ): Array<{ text: string; folder: Folder | null }> => {
    if (!folder) return [];

    const crumbs: Array<{ text: string; folder: Folder | null }> = [
      { text: "Root", folder: null },
    ];

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

  return {
    contextMenuFolder,
    findFolderByPath,
    generateBreadcrumbs,
    renameFolder,
    deleteFolder,
    createNewFolder,
  };
}
