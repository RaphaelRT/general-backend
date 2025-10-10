"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const env_1 = require("../config/env");
async function ensure(dbUrl) {
    const url = new URL(dbUrl);
    const dbName = url.pathname.replace(/^\//, "");
    const adminUrl = new URL(dbUrl);
    adminUrl.pathname = "/postgres";
    const admin = new pg_1.Client({ connectionString: adminUrl.toString() });
    await admin.connect();
    const exists = await admin.query("SELECT 1 FROM pg_database WHERE datname = $1", [dbName]);
    if (exists.rowCount === 0)
        await admin.query(`CREATE DATABASE "${dbName}"`);
    await admin.end();
}
ensure(env_1.env.portfolioDbUrl).then(() => ensure(env_1.env.intervuDbUrl)).then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
