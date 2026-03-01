import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "e2e/**"],
      root: fileURLToPath(new URL("./", import.meta.url)),
      globals: true,
      setupFiles: ["./src/test-utils/setup.ts"],
      css: true,
      server: {
        deps: {
          inline: ["vuetify"],
        },
      },
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        exclude: [
          "node_modules/",
          "e2e/",
          "**/*.spec.ts",
          "**/*.test.ts",
          "**/dist/**",
          "**/.{idea,git,cache,output,temp}/**",
        ],
      },
    },
  }),
);
