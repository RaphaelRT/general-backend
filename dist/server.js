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
const typeDefs_1 = require("./graphql/typeDefs");
const resolvers_1 = require("./graphql/resolvers");
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use((0, express_rate_limit_1.default)({ windowMs: 60000, max: 120 }));
app.use(body_parser_1.default.json());
app.get("/healthz", (_req, res) => {
    res.status(200).send("ok");
});
async function startHttpServer() {
    const server = new server_1.ApolloServer({ typeDefs: typeDefs_1.typeDefs, resolvers: resolvers_1.resolvers });
    await server.start();
    app.use("/graphql", body_parser_1.default.json(), (0, express4_1.expressMiddleware)(server, { context: async () => ({}) }));
    app.use("/api/graphql", body_parser_1.default.json(), (0, express4_1.expressMiddleware)(server, { context: async () => ({}) }));
    return new Promise(resolve => {
        app.listen(env_1.env.port, () => resolve());
    });
}
