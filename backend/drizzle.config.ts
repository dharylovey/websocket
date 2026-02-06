import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema/*.schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      'postgresql://postgres@localhost:5433/posts_db',
  },
  verbose: true,
  strict: true,
});
