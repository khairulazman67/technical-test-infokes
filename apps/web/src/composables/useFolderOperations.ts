import { ref } from "vue";
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
  const renameFolder = (folder: Folder, newName: string) => {
    // TODO: Call API to rename folder
    console.log("Rename folder:", folder.name, "to", newName);
    folder.name = newName;
  };

  // Delete folder
  const deleteFolder = (folder: Folder, parentFolders: Folder[]): boolean => {
    // TODO: Call API to delete folder
    console.log("Delete folder:", folder.name);
    const index = parentFolders.findIndex((f) => f.id === folder.id);
    if (index > -1) {
      parentFolders.splice(index, 1);
      return true;
    }
    return false;
  };

  // Create new folder
  const createNewFolder = (parentFolder: Folder, name: string): Folder => {
    // TODO: Call API to create new folder
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: name,
      path: `${parentFolder.path}/${name}`,
      children: [],
    };

    console.log("Create new folder:", newFolder);

    if (!parentFolder.children) {
      parentFolder.children = [];
    }
    parentFolder.children.push(newFolder);

    return newFolder;
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
