import 'reflect-metadata';

import path from 'path';

import bodyParser from 'body-parser';
import RedisStore from 'connect-redis';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import session from 'express-session';
import { createClient } from 'redis';

config({ path: path.join(__dirname, '../../.env') });

import db from './db';
import errorMiddleware from './middlewares/errorMiddleware';
import routes from './routes';

const app = express();

app.set('trust proxy', process.env.NODE_ENV === 'production');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);

const redisClient = createClient({
  url: `redis://${process.env.REDIS_URL}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});

redisClient.connect().catch((error) => {
  console.error(
    'Failed to connect to Redis!',
    `redis://${process.env.REDIS_URL}:${process.env.REDIS_PORT}`,
    error
  );
});

app.use(
  session({
    cookie: {
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    store: new RedisStore({ client: redisClient }),
  })
);

app.use(routes);
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  db.initialize()
    .catch((error) => {
      console.error('Failed to connect to database!', error);
    })
    .then(() => {
      console.log(`Server is running on http://localhost:${process.env.PORT}`);
    });
});
