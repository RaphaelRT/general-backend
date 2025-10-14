import { PrismaClient as IntervuClient } from "@prisma/intervu-client";
import { env } from "../../config/env";
import { instrumentPrismaClient } from "../../metrics/monitor";

export const intervuPrisma = new IntervuClient({
  log: [{ emit: "event", level: "query" }],
  datasources: {
    db: { url: env.intervuDbUrl }
  }
});

instrumentPrismaClient(intervuPrisma, "intervu");


