# Clan Halls

This is a web application that helps you manage your clan in Old School RuneScape. Use it with the [Clan Members Activity Tracker RuneLite plugin](https://github.com/raphpion/clan-members-activity-tracker).

## Getting Started

These instructions will give you a copy of the project up and running on
your local machine for development and testing purposes. See deployment
for notes on deploying the project on a live system.

### Prerequisites

Requirements for the software and other tools to build, test and push

- [Node.js](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Installation

First, you can install the dependencies by running the following command in the root directory of the project:

```bash
npm install
```

Then, create a `.env` file in the root directory of the project with the following content. Do not use these passwords in production!

> [!TIP]
> If you were to set the variables to build a production Docker image, you would need to set the postgres and redis URLs to `postgres` and `redis` respectively (the services names), as well as use the internal ports since the containers would run on the same Docker network.

```yaml
PORT=5000
SESSION_SECRET=some-secure-password-789
GOOGLE_CLIENT_ID=your-google-client-id

POSTGRES_URL=localhost
POSTGRES_PORT=5001
POSTGRES_USER=postgres
POSTGRES_PASSWORD=some-secure-password-123
POSTGRES_DB=clan-halls
POSTGRES_TEST_DB=clan-halls-test

REDIS_URL=localhost
REDIS_PORT=5002
REDIS_PASSWORD=some-secure-password-456

VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_API_BASE_URL=http://localhost:5000
```

### Using the utility scripts

To start the development environment, you can simply run the following command:

```bash
# Windows only
/scripts/dev.ps1

# Unix script (not yet implemented)
/scripts/dev.sh
```

To start the production environment, you can simply run the following command:

```bash
# Windows only (not yet implemented)
/scripts/prod.ps1

# Unix script (not yet implemented)
/scripts/prod.sh
```

### Entering the commands manually

Alternatively, you can run the following command to start the development containers:

```bash
docker compose up -f docker-compose.dev.yml
```

And run the following command to start the backend server:

```bash
npm run dev -w backend
```

Then run the following command to apply migrations:

```bash
npm run migrate -w backend
```

Finally, run the following command to start the frontend server:

```bash
npm run dev -w frontend
```

Please refer to the [backend's README](./backend/README.md) for more information on scripts.
