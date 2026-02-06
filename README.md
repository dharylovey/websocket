# Real-time WebSocket Dashboard Project

This project consists of a high-performance NestJS backend with Fastify and a generic HTML frontend dashboard for real-time data visualization via WebSockets.

## 📂 Project Structure

- **`backend/`**: NestJS application using Fastify, Drizzle ORM, and PostreSQL. Handles REST APIs and WebSocket connections.
- **`frontend/`**: Simple HTML/JS client to visualize real-time data.

## 🛠 Prerequisites

Ensure you have the following tools installed:

- **[Node.js](https://nodejs.org/)** (v20 or higher)
- **[PNPM](https://pnpm.io/)** (Package manager)
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (For running the database)

## 🚀 Getting Started

### 1. Database Setup (Docker)

The project uses PostgreSQL running in a Docker container.

1. Navigate to the `backend` directory:

   ```bash
   cd backend
   ```

2. Start the database container:
   ```bash
   docker-compose up -d
   ```
   _This will start a PostgreSQL instance exposed on port `5433` (mapped to internal `5432`)._

### 2. Backend Setup

1. **Install Dependencies:**

   ```bash
   pnpm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the `backend` directory (if not already present). You can copy `.env.example` if it exists, or use the following defaults:

   ```bash
   # backend/.env
   DATABASE_URL="postgresql://postgres@localhost:5433/posts_db"
   PORT=3000
   WS_PORT=3001
   CORS_ORIGIN="*"
   ```

3. **Database Migrations:**
   Apply the database schema:

   ```bash
   pnpm run db:migrate
   ```

4. **Start the Server:**

   ```bash
   pnpm run start:dev
   ```

   - **REST API:** `http://localhost:3000`
   - **WebSocket Server:** `ws://localhost:3001/ws`

### 3. Frontend Setup

1. **Open the Dashboard:**
   Simply open the `frontend/dashboard.html` file in your preferred web browser.

   _Tip: For a better experience, use a local development server (like VS Code's "Live Server" extension) to serve the `frontend` directory._

## 📜 Available Scripts (Backend)

| Script | Description |
| null | null |
| `pnpm run start:dev` | Start the app in watch mode |
| `pnpm run build` | Build the application for production |
| `pnpm run db:generate` | Generate migration files from schema |
| `pnpm run db:migrate` | Apply migrations to the database |
| `pnpm run db:studio` | Open Drizzle Studio to manage data |
| `pnpm run lint` | Lint and fix code style issues |

## 🔌 API & WebSockets

- **REST API Prefix:** `/api/v1` (Check `main.ts` logs for confirmation)
- **WebSocket URL:** `ws://localhost:3001/ws` (or port defined in `WS_PORT`)

## 🐛 Troubleshooting

- **Database Connection Error:** Ensure Docker is running and port `5433` is free. Check `DATABASE_URL` matches the `docker-compose.yml` configuration.
- **Module Not Found:** Run `pnpm install` in the backend directory.
- **CORS Issues:** The backend is configured to allow all origins (`*`) by default in development.

---

**Author:** Dharyl Almora
