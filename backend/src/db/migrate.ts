import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './schema/posts.schema';
import * as dotenv from 'dotenv';

dotenv.config();

async function runMigration() {
  const sql = postgres({
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    database: 'posts_db',
    max: 1,
  });
  const db = drizzle(sql, { schema });

  console.log('Running migrations...');

  await migrate(db, { migrationsFolder: './drizzle/migrations' });

  console.log('Migrations completed successfully');

  await sql.end();
  process.exit(0);
}

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
