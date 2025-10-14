"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startHttpServer = startHttpServer;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("./config/env");
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const body_parser_1 = __importDefault(require("body-parser"));
const graphql_1 = require("./graphql");
const monitor_1 = require("./metrics/monitor");
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use((0, express_rate_limit_1.default)({ windowMs: 60000, max: 120 }));
app.use(body_parser_1.default.json());
app.get("/healthz", (_req, res) => {
    res.status(200).send("ok");
});
app.get("/metrics", async (_req, res) => {
    try {
        const text = await (0, monitor_1.getMetricsText)();
        res.setHeader("Content-Type", "text/plain; version=0.0.4; charset=utf-8");
        res.status(200).send(text);
    }
    catch (e) {
        res.status(500).send("metrics error");
    }
});
app.get("/admin/top-queries", (req, res) => {
    const token = process.env.ADMIN_TOKEN;
    if (token) {
        const header = req.headers["authorization"];
        if (!header || !header.startsWith("Bearer ") || header.slice(7) !== token) {
            return res.status(401).json({ error: "unauthorized" });
        }
    }
    const limit = Math.max(1, Math.min(100, Number(req.query.limit ?? 20)));
    res.json({ items: (0, monitor_1.getTopQueries)(limit) });
});
async function startHttpServer() {
    const server = new server_1.ApolloServer({ typeDefs: graphql_1.typeDefs, resolvers: graphql_1.resolvers });
    await server.start();
    app.use("/graphql", body_parser_1.default.json(), (0, express4_1.expressMiddleware)(server, { context: async () => ({}) }));
    app.use("/api/graphql", body_parser_1.default.json(), (0, express4_1.expressMiddleware)(server, { context: async () => ({}) }));
    return new Promise(resolve => {
        app.listen(env_1.env.port, () => resolve());
    });
}
