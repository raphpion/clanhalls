import { join } from 'path';

import { config } from 'dotenv';
import Joi from 'joi';
import { injectable } from 'tsyringe';

config({ path: join(__dirname, '../.env') });

export type Config = {
  env: 'development' | 'production' | 'test';
  instances: number;
  port: number;
  sessionSecret: string;
  googleClientId: string;

  postgres: {
    host: string;
    port: number;
    user: string;
    password: string;
    dbName: string;
  };

  redis: {
    url: string;
    port: number;
    password: string;
  };

  wiseOldMan: {
    apiKey: string;
    userAgent: string;
  };
};

@injectable()
class ConfigService {
  private readonly configSchema = Joi.object<Config>({
    env: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    instances: Joi.number().integer().min(1).required(),
    port: Joi.number().integer().min(1).max(65535).required(),
    sessionSecret: Joi.string().required(),
    googleClientId: Joi.string().required(),

    postgres: Joi.object({
      host: Joi.string().required(),
      port: Joi.number().required(),
      user: Joi.string().required(),
      password: Joi.string().required(),
      dbName: Joi.string().required(),
    }),

    redis: Joi.object({
      url: Joi.string().required(),
      port: Joi.number().required(),
      password: Joi.string().required(),
    }),

    wiseOldMan: Joi.object({
      apiKey: Joi.string().required(),
      userAgent: Joi.string().required(),
    }),
  });

  private readonly config: Config;

  constructor() {
    this.config = {
      instances: Number(process.env.BACKEND_INSTANCES),
      port: Number(process.env.BACKEND_PORT || 5000),
      env: process.env.NODE_ENV as Config['env'],
      sessionSecret: process.env.SESSION_SECRET,
      googleClientId: process.env.GOOGLE_CLIENT_ID,

      postgres: {
        host: process.env.POSTGRES_URL,
        port: Number(process.env.POSTGRES_PORT),
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        dbName: process.env.POSTGRES_DB,
      },

      redis: {
        url: process.env.REDIS_URL,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },

      wiseOldMan: {
        apiKey: process.env.WISE_OLD_MAN_API_KEY,
        userAgent: process.env.WISE_OLD_MAN_USER_AGENT,
      },
    };

    const { error } = this.configSchema.validate(this.config);
    if (error) {
      throw new Error(`Invalid configuration: ${error.message}`);
    }
  }

  get<T>(selector: (config: Config) => T): T {
    return selector(this.config);
  }

  get isMainThread(): boolean {
    return (
      process.env.NODE_ENV === 'development' || process.env.THREAD_INDEX === '0'
    );
  }

  get isTest(): boolean {
    return process.env.NODE_ENV === 'test';
  }
}

export default ConfigService;
