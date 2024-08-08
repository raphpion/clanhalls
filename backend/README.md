# Backend

This backend uses [Express](https://expressjs.com/) and [TypeORM](https://typeorm.io/) to provide a REST API for the frontend and the RuneLite plugin. It uses [PostgreSQL](https://www.postgresql.org/) as the database and [Redis](https://redis.io/) as the session store, as well as a message queue for [BullMQ](https://docs.bullmq.io/).

In production, it runs on [pm2](https://pm2.keymetrics.io/) to benefit from load balancing and automatic restarts.

## TypeORM

In [`package.json`](./package.json), you can see a few scripts that are used to interact with the database in development. This is because TypeORM needs transpiled JavaScript to run the migrations and seeders.

> [!IMPORTANT]
> Remember to run these commands from the current directory!

- To drop the database, run the following command:

  ```bash
  npm run db:drop
  ```

- To apply all pending migrations, run the following command:

  ```bash
  npm run db:migrate
  ```

- To revert the last migration, run the following command:

  ```bash
  npm run db:revert
  ```

- To generate a new migration, run the following command:

  ```bash
  npm run db:generate src/db/migrations/<Name>
  ```

- To create a fresh migration file, run the following command:

  ```bash
  npm run db:create src/db/migrations/<Name>
  ```

- To reset the database to a clean state with up to date schema, run the following command:

  ```bash
  npm run db:reset
  ```
