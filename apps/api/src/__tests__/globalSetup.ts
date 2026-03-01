// Global setup file - runs once before all test suites
// This ensures the test database schema is up to date

import { execSync } from "child_process";
import { config } from "dotenv";
import { resolve } from "path";

export default async function globalSetup() {
  console.log("Global Test Setup");
  console.log("=".repeat(50));

  // Load .env.test
  const envPath = resolve(__dirname, "../../.env.test");
  const result = config({ path: envPath, override: true });

  if (result.error) {
    console.error("Error loading .env.test:", result.error);
    throw result.error;
  }

  // Verify DATABASE_URL
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in .env.test");
  }

  if (!process.env.DATABASE_URL.includes("test")) {
    console.error("WARNING: DATABASE_URL does not contain 'test'");
    console.error("Current DATABASE_URL:", process.env.DATABASE_URL);
    throw new Error(
      "DATABASE_URL must point to a test database (should contain 'test' in the name)",
    );
  }

  console.log("Environment loaded from .env.test");
  console.log(
    "📦 Database:",
    process.env.DATABASE_URL?.replace(/:[^:@]+@/, ":****@"),
  );
  console.log("");

  try {
    // Generate Prisma Client
    console.log("Generating Prisma Client...");
    execSync("./node_modules/.bin/prisma generate", {
      stdio: "inherit",
      env: { ...process.env },
    });
    console.log("Prisma Client generated");
    console.log("");

    // Push schema to test database (auto-sync)
    console.log("Syncing database schema...");
    execSync("./node_modules/.bin/prisma db push --skip-generate", {
      stdio: "inherit",
      env: { ...process.env },
    });
    console.log("Database schema synced");
    console.log("");

    console.log("Global setup complete!");
    console.log("=".repeat(50));
    console.log("");
  } catch (error) {
    console.error("Error during global setup:", error);
    throw error;
  }
}
