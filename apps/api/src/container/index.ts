import { FolderController } from "../controllers/folder.controller";
import { prisma } from "../database/prisma";
import { FolderRepository } from "../repositories/folder.repository";
import { FolderService } from "../services/folder.service";

class Container {
  private static instance: Container;
  private services: Map<string, any> = new Map();

  private constructor() {
    this.registerServices();
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  private registerServices(): void {
    // Register Repository
    const folderRepository = new FolderRepository(prisma);
    this.services.set("FolderRepository", folderRepository);

    // Register Service
    const folderService = new FolderService(folderRepository);
    this.services.set("FolderService", folderService);

    // Register Controller
    const folderController = new FolderController(folderService);
    this.services.set("FolderController", folderController);
  }

  public get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found in container`);
    }
    return service as T;
  }

  public getFolderRepository(): FolderRepository {
    return this.get<FolderRepository>("FolderRepository");
  }

  public getFolderService(): FolderService {
    return this.get<FolderService>("FolderService");
  }

  public getFolderController(): FolderController {
    return this.get<FolderController>("FolderController");
  }
}

export const container = Container.getInstance();
