import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';

// Post status enum
export const postStatusEnum = pgEnum('post_status', [
  'draft',
  'published',
  'archived',
]);

// Posts table
export const posts = pgTable(
  'posts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 160 }).notNull(),
    content: text('content').notNull(),
    status: postStatusEnum('status').notNull().default('draft'),
    authorId: uuid('author_id'), // Optional - nullable for now, can be enforced later with FK
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    createdAtIdx: index('posts_created_at_idx').on(table.createdAt),
    statusIdx: index('posts_status_idx').on(table.status),
  }),
);

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
