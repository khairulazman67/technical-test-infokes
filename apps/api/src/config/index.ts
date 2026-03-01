import type { Config } from "../types/config.types";

export const config: Config = {
  database: {
    url: process.env.DATABASE_URL as string,
  },
  server: {
    port: Number(process.env.PORT),
  },
  env: process.env.NODE_ENV as string,
};
