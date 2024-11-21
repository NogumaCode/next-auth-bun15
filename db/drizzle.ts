import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

// 環境変数を安全に取得
const databaseUrl = process.env.NEON_DATABASE_URL;

if (!databaseUrl) {
  throw new Error("NEON_DATABASE_URL is not defined in the environment variables.");
}

const sql = neon(databaseUrl);
const db = drizzle(sql);

export default db;
