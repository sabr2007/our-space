import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Users (hardcoded, not created via UI)
export const users = sqliteTable("users", {
  id: integer("id").primaryKey(), // 1 = Сабыржан, 2 = Аида
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
});

// Timeline events
export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date").notNull(), // ISO date "2024-09-02"
  photoUrl: text("photo_url"),
  createdBy: integer("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: text("created_at")
    .notNull()
    .default("CURRENT_TIMESTAMP"),
  sortOrder: integer("sort_order").notNull().default(0),
});

// "Первый раз когда..."
export const firsts = sqliteTable("firsts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date"), // optional
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default("CURRENT_TIMESTAMP"),
});

// Notes (messages)
export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
  authorId: integer("author_id")
    .notNull()
    .references(() => users.id),
  isRead: integer("is_read").notNull().default(0), // 0 = false, 1 = true
  createdAt: text("created_at")
    .notNull()
    .default("CURRENT_TIMESTAMP"),
});

// Time capsules (messages with unlock date)
export const capsules = sqliteTable("capsules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
  authorId: integer("author_id")
    .notNull()
    .references(() => users.id),
  unlockAt: text("unlock_at").notNull(), // ISO datetime when can be read
  isRead: integer("is_read").notNull().default(0),
  createdAt: text("created_at")
    .notNull()
    .default("CURRENT_TIMESTAMP"),
});
