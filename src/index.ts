import { env } from "./config/env";
import { portfolioPrisma } from "./modules/portfolio/db";
import { intervuPrisma } from "./modules/intervu/db";
import { startHttpServer } from "./server";

async function main() {
  await portfolioPrisma.$connect();
  await intervuPrisma.$connect();
  await startHttpServer();
}

main().catch(err => { console.error(err); process.exit(1); });


