// eslint-disable-next-line import/order
import 'reflect-metadata';

import bodyParser from 'body-parser';
import RedisStore from 'connect-redis';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import { createClient } from 'redis';
import type { DataSource } from 'typeorm';

import type ConfigService from './config';
import container from './container';
import type { IJobsService } from './jobs/jobsService';
import errorMiddleware from './middleware/errorMiddleware';
import routes from './routes';

startup();

async function startup() {
  const app = express();
  const db = container.resolve<DataSource>('DataSource');

  await Promise.all([initializeSession(app), db.initialize()]);
  await container.resolve<IJobsService>('JobsService').initialize();

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  initializeApi(app);
}

async function initializeSession(app: express.Application) {
  const configService = container.resolve<ConfigService>('ConfigService');
  const isProduction = configService.get((c) => c.env) === 'production';
  const sessionSecret = configService.get((c) => c.sessionSecret);
  const redisConfig = configService.get((c) => c.redis);

  app.set('trust proxy', isProduction);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cookieParser(sessionSecret));
  app.use(
    cors({
      origin: isProduction ? 'https://app.clanhalls.net' : '*',
      credentials: true,
    }),
  );

  const redisClient = createClient({
    url: `redis://${redisConfig.url}:${redisConfig.port}`,
    password: redisConfig.password,
  });

  redisClient.connect().catch((error) => {
    console.error(
      'Failed to connect to Redis!',
      `redis://${redisConfig.url}:${redisConfig.port}`,
      error,
    );
  });

  app.use(
    session({
      cookie: {
        httpOnly: isProduction,
        secure: isProduction,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      },
      resave: false,
      saveUninitialized: false,
      secret: sessionSecret,
      store: new RedisStore({ client: redisClient }),
    }),
  );
}

async function shutdown(signal: string) {
  console.log(`Recieved ${signal}. Shutting down...`);
  await container.resolve<IJobsService>('JobsService').shutdown();
  process.exit();
}

async function initializeApi(app: express.Application) {
  const port = container
    .resolve<ConfigService>('ConfigService')
    .get((c) => c.port);

  app.use(routes);
  app.use(errorMiddleware);

  app.listen(port, () =>
    console.log(`Server is running on http://localhost:${port}`),
  );
}
