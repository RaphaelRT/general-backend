"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./modules/portfolio/db");
const db_2 = require("./modules/intervu/db");
const server_1 = require("./server");
async function main() {
    await db_1.portfolioPrisma.$connect();
    await db_2.intervuPrisma.$connect();
    await (0, server_1.startHttpServer)();
}
main().catch(err => { console.error(err); process.exit(1); });
