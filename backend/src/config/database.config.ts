export const databaseConfig = () => ({
  database: {
    url:
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:5432/posts_db',
  },
});
