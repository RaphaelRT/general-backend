import { env } from "./config/env";
import { portfolioPrisma, intervuPrisma } from "./db/client";
import { startHttpServer } from "./server";

async function main() {
  await portfolioPrisma.$connect();
  await intervuPrisma.$connect();
  await startHttpServer();
}

main().catch(err => { console.error(err); process.exit(1); });


