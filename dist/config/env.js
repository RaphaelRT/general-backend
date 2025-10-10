"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const schema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().url().optional(),
    DATABASE_URL_PORTFOLIO: zod_1.z.string().url().optional(),
    DATABASE_URL_INTERVU: zod_1.z.string().url().optional(),
    PORT: zod_1.z.string().optional(),
    NODE_ENV: zod_1.z.string().default("development")
});
const parsed = schema.parse(process.env);
function deriveFromBase(baseUrl, dbName) {
    const url = new URL(baseUrl);
    url.pathname = `/${dbName}`;
    if (!url.searchParams.has("schema"))
        url.searchParams.set("schema", "public");
    return url.toString();
}
const portfolioDbUrl = parsed.DATABASE_URL_PORTFOLIO
    ?? (parsed.DATABASE_URL ? deriveFromBase(parsed.DATABASE_URL, "portfolio") : undefined);
const intervuDbUrl = parsed.DATABASE_URL_INTERVU
    ?? (parsed.DATABASE_URL ? deriveFromBase(parsed.DATABASE_URL, "intervu") : undefined);
if (!portfolioDbUrl || !intervuDbUrl) {
    throw new Error("DATABASE_URL manquante ou incomplète: fournissez DATABASE_URL ou bien DATABASE_URL_PORTFOLIO et DATABASE_URL_INTERVU.");
}
exports.env = {
    portfolioDbUrl,
    intervuDbUrl,
    port: Number(parsed.PORT ?? 4000),
    nodeEnv: parsed.NODE_ENV
};
