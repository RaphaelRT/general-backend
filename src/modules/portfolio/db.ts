import { PrismaClient as PortfolioClient } from "@prisma/portfolio-client";
import { env } from "../../config/env";

export const portfolioPrisma = new PortfolioClient({
  datasources: {
    db: { url: env.portfolioDbUrl }
  }
});


