import { PrismaClient as IntervuClient } from "@prisma/intervu-client";
import { env } from "../../config/env";

export const intervuPrisma = new IntervuClient({
  datasources: {
    db: { url: env.intervuDbUrl }
  }
});


