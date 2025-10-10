"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./db/client");
const server_1 = require("./server");
async function main() {
    await client_1.portfolioPrisma.$connect();
    await client_1.intervuPrisma.$connect();
    await (0, server_1.startHttpServer)();
}
main().catch(err => { console.error(err); process.exit(1); });
