import { Elysia } from "elysia";

new Elysia()
  .get("/", () => ({
    message: "Hello from Elysia API 🚀",
  }))
  .listen(3000);

console.log("API running at http://localhost:3000");
