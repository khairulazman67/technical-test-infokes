import { Elysia, t } from "elysia";
import { FolderController } from "../controllers/folder.controller";

export const createFolderRoutes = (folderController: FolderController) => {
  const app = new Elysia({ prefix: "/folders" });

  // GET /folders - Get all folders
  app.get(
    "/",
    async () => {
      return await folderController.getAllFolders();
    },
    {
      detail: {
        tags: ["Folders"],
        summary: "Get all folders",
        description: "Retrieve all folders in flat structure",
        responses: {
          200: {
            description: "List of all folders",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string", format: "uuid" },
                          name: { type: "string" },
                          path: { type: "string" },
                          parentId: {
                            type: "string",
                            format: "uuid",
                            nullable: true,
                          },
                          createdAt: { type: "string", format: "date-time" },
                          updatedAt: { type: "string", format: "date-time" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  );

  // GET /folders/tree - Get folder tree structure
  app.get(
    "/tree",
    async () => {
      return await folderController.getFolderTree();
    },
    {
      detail: {
        tags: ["Folders"],
        summary: "Get folder tree",
        description: "Retrieve folders in hierarchical tree structure",
        responses: {
          200: {
            description: "Folder tree structure",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string", format: "uuid" },
                          name: { type: "string" },
                          path: { type: "string" },
                          children: {
                            type: "array",
                            items: { $ref: "#/components/schemas/FolderTree" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  );

  // GET /folders/search - Search folders
  app.get(
    "/search",
    async ({ query }) => {
      return await folderController.searchFolders(query.q || "");
    },
    {
      query: t.Object({
        q: t.String({ minLength: 1, description: "Search query" }),
      }),
      detail: {
        tags: ["Folders"],
        summary: "Search folders",
        description: "Search folders by name (case-insensitive)",
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            schema: { type: "string", minLength: 1 },
            description: "Search query string",
            example: "work",
          },
        ],
        responses: {
          200: {
            description: "Search results",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string", format: "uuid" },
                          name: { type: "string" },
                          path: { type: "string" },
                          parentId: {
                            type: "string",
                            format: "uuid",
                            nullable: true,
                          },
                          createdAt: { type: "string", format: "date-time" },
                          updatedAt: { type: "string", format: "date-time" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error - query parameter required",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: false },
                    error: { type: "string", example: "Validation error" },
                  },
                },
              },
            },
          },
        },
      },
    },
  );

  // GET /folders/:id - Get folder by ID
  app.get(
    "/:id",
    async ({ params }) => {
      return await folderController.getFolderById(params.id);
    },
    {
      params: t.Object({
        id: t.String({ description: "Folder ID (UUID)" }),
      }),
      detail: {
        tags: ["Folders"],
        summary: "Get folder by ID",
        description: "Retrieve a specific folder by its ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
            description: "Folder ID",
          },
        ],
        responses: {
          200: {
            description: "Folder details",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string" },
                        path: { type: "string" },
                        parentId: {
                          type: "string",
                          format: "uuid",
                          nullable: true,
                        },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Folder not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: false },
                    error: { type: "string", example: "Folder not found" },
                  },
                },
              },
            },
          },
        },
      },
    },
  );

  // GET /folders/children/:parentId - Get folders by parent ID
  app.get(
    "/children/:parentId",
    async ({ params }) => {
      const parentId = params.parentId === "null" ? null : params.parentId;
      return await folderController.getFoldersByParentId(parentId);
    },
    {
      params: t.Object({
        parentId: t.String({
          description: "Parent folder ID (use 'null' for root folders)",
        }),
      }),
      detail: {
        tags: ["Folders"],
        summary: "Get folders by parent ID",
        description:
          "Retrieve direct children of a folder. Use 'null' for root folders",
        parameters: [
          {
            name: "parentId",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Parent folder ID or 'null' for root folders",
          },
        ],
        responses: {
          200: {
            description: "List of child folders",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string", format: "uuid" },
                          name: { type: "string" },
                          path: { type: "string" },
                          parentId: {
                            type: "string",
                            format: "uuid",
                            nullable: true,
                          },
                          createdAt: { type: "string", format: "date-time" },
                          updatedAt: { type: "string", format: "date-time" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  );

  // POST /folders - Create new folder
  app.post(
    "/",
    async ({ body }) => {
      return await folderController.createFolder(body);
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1, description: "Folder name" }),
        parentId: t.Optional(
          t.String({ description: "Parent folder ID (optional)" }),
        ),
      }),
      detail: {
        tags: ["Folders"],
        summary: "Create new folder",
        description:
          "Create a new folder. If parentId is provided, folder will be created as a child",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: {
                    type: "string",
                    minLength: 1,
                    description: "Folder name",
                    example: "My Folder",
                  },
                  parentId: {
                    type: "string",
                    format: "uuid",
                    description: "Parent folder ID (optional)",
                    example: "123e4567-e89b-12d3-a456-426614174000",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Folder created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string" },
                        path: { type: "string" },
                        parentId: {
                          type: "string",
                          format: "uuid",
                          nullable: true,
                        },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Validation error or folder already exists",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: false },
                    error: {
                      type: "string",
                      example: "Folder with this path already exists",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  );

  // PUT /folders/:id - Update folder
  app.put(
    "/:id",
    async ({ params, body }) => {
      return await folderController.updateFolder(params.id, body);
    },
    {
      params: t.Object({
        id: t.String({ description: "Folder ID (UUID)" }),
      }),
      body: t.Object({
        name: t.Optional(
          t.String({ minLength: 1, description: "New folder name" }),
        ),
        parentId: t.Optional(t.String({ description: "New parent folder ID" })),
      }),
      detail: {
        tags: ["Folders"],
        summary: "Update folder",
        description:
          "Update folder name or move to different parent. Path will be auto-updated",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
            description: "Folder ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    minLength: 1,
                    description: "New folder name",
                    example: "Updated Folder",
                  },
                  parentId: {
                    type: "string",
                    format: "uuid",
                    description: "New parent folder ID",
                    example: "123e4567-e89b-12d3-a456-426614174000",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Folder updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "string", format: "uuid" },
                        name: { type: "string" },
                        path: { type: "string" },
                        parentId: {
                          type: "string",
                          format: "uuid",
                          nullable: true,
                        },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Folder not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: false },
                    error: { type: "string", example: "Folder not found" },
                  },
                },
              },
            },
          },
        },
      },
    },
  );

  // DELETE /folders/:id - Delete folder
  app.delete(
    "/:id",
    async ({ params }) => {
      return await folderController.deleteFolder(params.id);
    },
    {
      params: t.Object({
        id: t.String({ description: "Folder ID (UUID)" }),
      }),
      detail: {
        tags: ["Folders"],
        summary: "Delete folder",
        description: "Delete a folder and all its children (cascade delete)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
            description: "Folder ID",
          },
        ],
        responses: {
          200: {
            description: "Folder deleted successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: {
                      type: "string",
                      example: "Folder deleted successfully",
                    },
                  },
                },
              },
            },
          },
          404: {
            description: "Folder not found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: false },
                    error: { type: "string", example: "Folder not found" },
                  },
                },
              },
            },
          },
        },
      },
    },
  );

  return app;
};
