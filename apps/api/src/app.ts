import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { config } from "./config";
import { container } from "./container";
import { database } from "./database/prisma";
import { createFolderRoutes } from "./routes/folder.routes";

export const createApp = async () => {
  // Connect to database
  await database.connect();

  // Get controller from container
  const folderController = container.getFolderController();

  // Create Elysia app
  const app = new Elysia()
    .use(
      swagger({
        documentation: {
          info: {
            title: "Folder Explorer API",
            version: "1.0.0",
            description:
              "RESTful API for managing folder structures with hierarchical relationships",
          },
          tags: [
            {
              name: "Folders",
              description: "Folder management endpoints",
            },
          ],
          servers: [
            {
              url: `http://localhost:${config.server.port}`,
              description: "Development server",
            },
          ],
          components: {
            schemas: {
              Folder: {
                type: "object",
                properties: {
                  id: { type: "string", format: "uuid" },
                  name: { type: "string" },
                  path: { type: "string" },
                  parentId: { type: "string", format: "uuid", nullable: true },
                  createdAt: { type: "string", format: "date-time" },
                  updatedAt: { type: "string", format: "date-time" },
                },
              },
              FolderTree: {
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
              SuccessResponse: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: true },
                  data: { type: "object" },
                },
              },
              ErrorResponse: {
                type: "object",
                properties: {
                  success: { type: "boolean", example: false },
                  error: { type: "string" },
                  details: { type: "string" },
                },
              },
            },
          },
        },
      }),
    )
    .use(
      cors({
        origin: true,
        credentials: true,
      }),
    )
    .get("/", () => ({
      message: "Folder Explorer API",
      version: "1.0.0",
      status: "running",
      documentation: "/swagger",
    }))
    .get("/health", () => ({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
    }))
    .use(createFolderRoutes(folderController))
    .onError(({ code, error, set }) => {
      console.error("Error:", error);

      if (code === "VALIDATION") {
        set.status = 400;
        return {
          success: false,
          error: "Validation error",
          details: error.toString(),
        };
      }

      if (code === "NOT_FOUND") {
        set.status = 404;
        return {
          success: false,
          error: "Route not found",
        };
      }

      set.status = 500;
      return {
        success: false,
        error: "Internal server error",
        message: error.toString(),
      };
    });

  return app;
};

export const startServer = async () => {
  try {
    const app = await createApp();
    const port = config.server.port;

    app.listen(port);

    console.log(`
🚀 Server is running!
    
📍 URL: http://localhost:${port}
🌍 Environment: ${config.env}
📊 Health: http://localhost:${port}/health
📁 Folders API: http://localhost:${port}/folders
📚 Swagger Docs: http://localhost:${port}/swagger
    `);

    // Graceful shutdown
    process.on("SIGINT", async () => {
      console.log("\n Shutting down gracefully...");
      await database.disconnect();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log("\n Shutting down gracefully...");
      await database.disconnect();
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};
