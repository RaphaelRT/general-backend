import { PrismaClient as PortfolioClient } from "@prisma/portfolio-client";
import { env } from "../../config/env";
import { instrumentPrismaClient } from "../../metrics/monitor";

export const portfolioPrisma = new PortfolioClient({
  log: [{ emit: "event", level: "query" }],
  datasources: {
    db: { url: env.portfolioDbUrl }
  }
});

instrumentPrismaClient(portfolioPrisma, "portfolio");


