import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  DATABASE_URL: z.string().url().optional(),
  DATABASE_URL_PORTFOLIO: z.string().url().optional(),
  DATABASE_URL_INTERVU: z.string().url().optional(),
  PORT: z.string().optional(),
  NODE_ENV: z.string().default("development")
});

const parsed = schema.parse(process.env);

function deriveFromBase(baseUrl: string, dbName: string): string {
  const url = new URL(baseUrl);
  url.pathname = `/${dbName}`;
  if (!url.searchParams.has("schema")) url.searchParams.set("schema", "public");
  return url.toString();
}

const portfolioDbUrl = parsed.DATABASE_URL_PORTFOLIO
  ?? (parsed.DATABASE_URL ? deriveFromBase(parsed.DATABASE_URL, "portfolio") : undefined);
const intervuDbUrl = parsed.DATABASE_URL_INTERVU
  ?? (parsed.DATABASE_URL ? deriveFromBase(parsed.DATABASE_URL, "intervu") : undefined);

if (!portfolioDbUrl || !intervuDbUrl) {
  throw new Error("DATABASE_URL manquante ou incomplète: fournissez DATABASE_URL ou bien DATABASE_URL_PORTFOLIO et DATABASE_URL_INTERVU.");
}

export const env = {
  portfolioDbUrl,
  intervuDbUrl,
  port: Number(parsed.PORT ?? 4000),
  nodeEnv: parsed.NODE_ENV
};



