import { clearFolders, seedFolders } from "./seeds/folder/seedFolders";
import { createFolder } from "./unitTest/folder/createFolder";
import { deleteFolder } from "./unitTest/folder/deleteFolder";
import { getAllFolders } from "./unitTest/folder/getAllFolders";
import { getFolderById } from "./unitTest/folder/getFolderById";
import { getFoldersByParentId } from "./unitTest/folder/getFoldersByParentId";
import { getFolderTree } from "./unitTest/folder/getFolderTree";
import { searchFolders } from "./unitTest/folder/searchFolders";
import { updateFolder } from "./unitTest/folder/updateFolder";

describe("FolderService Unit Tests", () => {
  beforeAll(async () => {
    try {
      await seedFolders();
      console.log("Test data seeded successfully");
    } catch (error) {
      console.error("Error when seeding data:", error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      // Clear test data after all tests
      await clearFolders();
      console.log("Test data cleared successfully");
    } catch (error) {
      console.error("Error when clearing data:", error);
    }
  });

  createFolder();
  getAllFolders();
  getFolderById();
  deleteFolder();
  searchFolders();
  updateFolder();
  getFoldersByParentId();
  getFolderTree();
});
