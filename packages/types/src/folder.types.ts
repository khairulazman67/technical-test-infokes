/**
 * Folder entity interface
 * Used for representing folder data from API
 */
export interface Folder {
  id: string;
  name: string;
  path: string;
  parentId: string | null;
  children?: Folder[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

/**
 * DTO for creating a new folder
 */
export interface CreateFolderDTO {
  name: string;
  parentId?: string;
}

/**
 * DTO for updating an existing folder
 */
export interface UpdateFolderDTO {
  name?: string;
  parentId?: string;
}

/**
 * Folder tree structure (simplified for tree view)
 */
export interface FolderTreeDTO {
  id: string;
  name: string;
  path: string;
  children?: FolderTreeDTO[];
}

/**
 * Breadcrumb item for navigation
 */
export interface BreadcrumbItem {
  text: string;
  folder: Folder | null;
}
