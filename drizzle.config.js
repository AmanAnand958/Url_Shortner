import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    // Falls back to direct string if process.env isn't populated by dotenv
    url: process.env.DATABASE_URL,
  },
});
