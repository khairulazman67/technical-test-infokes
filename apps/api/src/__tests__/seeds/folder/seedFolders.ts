import { prisma } from "../../../database/prisma";

export const clearFolders = async () => {
  // Delete all test folders
  await prisma.folder.deleteMany();
};

export const seedFolders = async () => {
  // Clear first to ensure clean state
  await clearFolders();

  // Create root folders
  const rootFolder1 = await prisma.folder.create({
    data: {
      id: "test-root-1",
      name: "Root Folder 1",
      path: "/Root Folder 1",
      parentId: null,
    },
  });

  const rootFolder2 = await prisma.folder.create({
    data: {
      id: "test-root-2",
      name: "Root Folder 2",
      path: "/Root Folder 2",
      parentId: null,
    },
  });

  // Create child folders
  const childFolder1 = await prisma.folder.create({
    data: {
      id: "test-child-1",
      name: "Child Folder 1",
      path: "/Root Folder 1/Child Folder 1",
      parentId: rootFolder1.id,
    },
  });

  const childFolder2 = await prisma.folder.create({
    data: {
      id: "test-child-2",
      name: "Child Folder 2",
      path: "/Root Folder 1/Child Folder 2",
      parentId: rootFolder1.id,
    },
  });

  // Create nested child folder
  const nestedChild = await prisma.folder.create({
    data: {
      id: "test-nested-1",
      name: "Nested Folder",
      path: "/Root Folder 1/Child Folder 1/Nested Folder",
      parentId: childFolder1.id,
    },
  });

  // Create folder for search tests
  const searchFolder = await prisma.folder.create({
    data: {
      id: "test-search-1",
      name: "Documents",
      path: "/Documents",
      parentId: null,
    },
  });

  return {
    rootFolder1,
    rootFolder2,
    childFolder1,
    childFolder2,
    nestedChild,
    searchFolder,
  };
};
