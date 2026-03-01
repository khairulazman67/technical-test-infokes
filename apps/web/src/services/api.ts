import type {
  ApiResponse,
  CreateFolderDTO,
  Folder,
  FolderTreeDTO,
  UpdateFolderDTO,
} from "@repo/types";
import { isSuccessResponse } from "@repo/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const data: ApiResponse<T> = await response.json();

  if (!isSuccessResponse(data)) {
    throw new ApiError(data.error);
  }

  return data.data;
}

export const folderApi = {
  /**
   * Get all folders
   */
  async getAll(): Promise<Folder[]> {
    return fetchApi<Folder[]>("/folders");
  },

  /**
   * Get folder tree structure
   */
  async getTree(): Promise<FolderTreeDTO[]> {
    return fetchApi<FolderTreeDTO[]>("/folders/tree");
  },

  /**
   * Search folders by name
   */
  async search(query: string): Promise<Folder[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }
    return fetchApi<Folder[]>(`/folders/search?q=${encodeURIComponent(query)}`);
  },

  /**
   * Get folder by ID
   */
  async getById(id: string): Promise<Folder> {
    return fetchApi<Folder>(`/folders/${id}`);
  },

  /**
   * Get folders by parent ID
   */
  async getByParentId(parentId: string | null): Promise<Folder[]> {
    const pid = parentId === null ? "null" : parentId;
    return fetchApi<Folder[]>(`/folders/children/${pid}`);
  },

  /**
   * Create new folder
   */
  async create(data: CreateFolderDTO): Promise<Folder> {
    return fetchApi<Folder>("/folders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update folder
   */
  async update(id: string, data: UpdateFolderDTO): Promise<Folder> {
    return fetchApi<Folder>(`/folders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete folder
   */
  async delete(id: string): Promise<void> {
    await fetchApi<void>(`/folders/${id}`, {
      method: "DELETE",
    });
  },
};
