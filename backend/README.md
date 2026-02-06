# NestJS Real-time Backend

Production-ready NestJS backend service with REST APIs and WebSocket support, using Fastify for high performance.

## 🏗 Stack

- **Framework:** NestJS + Fastify
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **WebSockets:** `@nestjs/websockets` + `ws`

## ⚙️ Configuration

Ensure your `.env` file is configured correctly:

```env
DATABASE_URL="postgresql://postgres@localhost:5433/posts_db"
PORT=3000
WS_PORT=3001
```

> **Note:** The `docker-compose.yml` maps the container's port 5432 to host port **5433**.

## 🛠 Commands

### Development

```bash
# Install dependencies
pnpm install

# Start database
docker-compose up -d

# Run migrations
pnpm run db:migrate

# Start server
pnpm run start:dev
```

### Database Management (Drizzle)

```bash
# Generate migrations schema
pnpm run db:generate

# Apply migrations
pnpm run db:migrate

# Open database studio UI
pnpm run db:studio
```

## 📁 Directory Structure

- `src/config`: Configuration files (Database, etc.)
- `src/db`: Drizzle schema and connection logic
- `src/posts`: Posts resource (Controller, Service, Repository)
- `src/ws`: WebSocket Gateway and logic

For full project setup instructions, please refer to the [Root README](../README.md).
