import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  await prisma.folder.deleteMany();

  // Create root folders
  const documents = await prisma.folder.create({
    data: {
      name: "Documents",
      path: "/Documents",
    },
  });

  const downloads = await prisma.folder.create({
    data: {
      name: "Downloads",
      path: "/Downloads",
    },
  });

  const pictures = await prisma.folder.create({
    data: {
      name: "Pictures",
      path: "/Pictures",
    },
  });

  // Create Documents subfolders
  const work = await prisma.folder.create({
    data: {
      name: "Work",
      path: "/Documents/Work",
      parentId: documents.id,
    },
  });

  const personal = await prisma.folder.create({
    data: {
      name: "Personal",
      path: "/Documents/Personal",
      parentId: documents.id,
    },
  });

  // Create Work subfolders
  await prisma.folder.create({
    data: {
      name: "Projects",
      path: "/Documents/Work/Projects",
      parentId: work.id,
    },
  });

  const reports = await prisma.folder.create({
    data: {
      name: "Reports",
      path: "/Documents/Work/Reports",
      parentId: work.id,
    },
  });

  // Create Reports subfolders
  await prisma.folder.create({
    data: {
      name: "Q1-2024",
      path: "/Documents/Work/Reports/Q1-2024",
      parentId: reports.id,
    },
  });

  await prisma.folder.create({
    data: {
      name: "Q2-2024",
      path: "/Documents/Work/Reports/Q2-2024",
      parentId: reports.id,
    },
  });

  // Create Downloads subfolders
  await prisma.folder.create({
    data: {
      name: "Software",
      path: "/Downloads/Software",
      parentId: downloads.id,
    },
  });

  // Create Pictures subfolders
  const vacation = await prisma.folder.create({
    data: {
      name: "Vacation",
      path: "/Pictures/Vacation",
      parentId: pictures.id,
    },
  });

  await prisma.folder.create({
    data: {
      name: "2024",
      path: "/Pictures/Vacation/2024",
      parentId: vacation.id,
    },
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
