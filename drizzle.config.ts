import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

dotenv.config({
  path: ".env.local", // 正しいパスを指定
});

const databaseUrl = process.env.NEON_DATABASE_URL;

if (!databaseUrl) {
  throw new Error("NEON_DATABASE_URL is not defined in the environment variables.");
}

export default defineConfig({
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
