import { PrismaClient as PortfolioClient } from "@prisma/portfolio-client";
import { PrismaClient as IntervuClient } from "@prisma/intervu-client";

export const portfolioPrisma = new PortfolioClient();
export const intervuPrisma = new IntervuClient();



