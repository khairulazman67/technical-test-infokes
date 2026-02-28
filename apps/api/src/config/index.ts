interface Config {
  database: {
    url: string;
  };
  server: {
    port: number;
  };
  env: string;
}

class ConfigService {
  private static instance: ConfigService;
  private config: Config;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  private loadConfig(): Config {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }

    return {
      database: {
        url: databaseUrl,
      },
      server: {
        port: parseInt(process.env.PORT || "3000", 10),
      },
      env: process.env.NODE_ENV || "development",
    };
  }

  public get<K extends keyof Config>(key: K): Config[K] {
    return this.config[key];
  }

  public getAll(): Config {
    return this.config;
  }
}

export const config = ConfigService.getInstance();
export type { Config };
