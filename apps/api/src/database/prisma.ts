import { PrismaClient } from "@prisma/client";
import { config } from "../config";

class DatabaseService {
  private static instance: DatabaseService;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: config.get("database").url,
        },
      },
      log:
        config.get("env") === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public getClient(): PrismaClient {
    return this.prisma;
  }

  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      console.log("✅ Database connected successfully");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
    console.log("Database disconnected");
  }
}

export const database = DatabaseService.getInstance();
export const prisma = database.getClient();
