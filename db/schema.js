import { uuid,integer, pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: text().notNull(),
  salt:text().notNull(),
  createdAt:timestamp().notNull().defaultNow(),
  updatedAt:timestamp().notNull().defaultNow(),
});

 export const urlTable = pgTable("urls", {
    id: uuid().primaryKey().defaultRandom(),
    shortUrl: varchar({ length: 255 }).notNull(),
    url: text().notNull(),
    userId: uuid().notNull().references(() => usersTable.id),
    createdAt:timestamp().notNull().defaultNow(),
    updatedAt:timestamp().notNull().defaultNow(),
  });