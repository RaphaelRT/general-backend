import { Client } from "pg";
import { env } from "../config/env";

async function ensure(dbUrl: string) {
  const url = new URL(dbUrl);
  const dbName = url.pathname.replace(/^\//, "");
  const adminUrl = new URL(dbUrl);
  adminUrl.pathname = "/postgres";
  const admin = new Client({ connectionString: adminUrl.toString() });
  await admin.connect();
  const exists = await admin.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);
  if (exists.rowCount === 0) await admin.query(`CREATE DATABASE "${dbName}"`);
  await admin.end();
}

ensure(env.portfolioDbUrl).then(() => ensure(env.intervuDbUrl)).then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });



