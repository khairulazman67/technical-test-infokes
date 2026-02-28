import { Folder, PrismaClient } from "@prisma/client";
import { prisma } from "../database/prisma";

export class FolderRepository {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient = prisma) {
    this.prisma = prismaClient;
  }

  async findAll(): Promise<Folder[]> {
    return this.prisma.folder.findMany({
      orderBy: {
        path: "asc",
      },
    });
  }

  async findById(id: string): Promise<Folder | null> {
    return this.prisma.folder.findUnique({
      where: { id },
    });
  }

  async findByPath(path: string): Promise<Folder | null> {
    return this.prisma.folder.findUnique({
      where: { path },
    });
  }

  async findByParentId(parentId: string | null): Promise<Folder[]> {
    return this.prisma.folder.findMany({
      where: { parentId },
      orderBy: {
        name: "asc",
      },
    });
  }

  async findRootFolders(): Promise<Folder[]> {
    return this.prisma.folder.findMany({
      where: { parentId: null },
      orderBy: {
        name: "asc",
      },
    });
  }

  async create(data: {
    name: string;
    path: string;
    parentId?: string;
  }): Promise<Folder> {
    return this.prisma.folder.create({
      data: {
        name: data.name,
        path: data.path,
        parentId: data.parentId || null,
      },
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      path?: string;
      parentId?: string;
    },
  ): Promise<Folder> {
    return this.prisma.folder.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Folder> {
    return this.prisma.folder.delete({
      where: { id },
    });
  }

  async deleteMany(ids: string[]): Promise<number> {
    const result = await this.prisma.folder.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return result.count;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.folder.count({
      where: { id },
    });
    return count > 0;
  }

  async pathExists(path: string): Promise<boolean> {
    const count = await this.prisma.folder.count({
      where: { path },
    });
    return count > 0;
  }

  async search(query: string): Promise<Folder[]> {
    return this.prisma.folder.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      orderBy: {
        path: "asc",
      },
    });
  }
}
