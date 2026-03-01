// Jest setup file
// This file runs before all tests

import { config } from "dotenv";
import { resolve } from "path";

// IMPORTANT: Clear any existing env vars that might have been loaded from .env
// Then load .env.test file with override to ensure test environment
const envPath = resolve(__dirname, "../../.env.test");

// Load .env.test and override any existing values
const result = config({ path: envPath, override: true });

if (result.error) {
  console.error("Error loading .env.test:", result.error);
  throw result.error;
}

// Set test environment
process.env.NODE_ENV = "test";

// Verify DATABASE_URL is set and points to test database
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

// Increase timeout for integration tests
jest.setTimeout(10000);

// Log environment for debugging
console.log("Test Environment:");
console.log("- NODE_ENV:", process.env.NODE_ENV);
console.log(
  "- DATABASE_URL:",
  process.env.DATABASE_URL?.replace(/:[^:@]+@/, ":****@"),
); // Hide password
console.log("- PORT:", process.env.PORT);
console.log("");
