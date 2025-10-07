import { env } from "./config/env";
import { prisma } from "./db/client";
import { startHttpServer } from "./server";

async function main() {
  await prisma.$connect();
  await startHttpServer();
}

main().catch(err => { console.error(err); process.exit(1); });


