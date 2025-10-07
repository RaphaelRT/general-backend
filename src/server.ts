import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import { portfolioRouter } from "./modules/portfolio/routes";
import { intervuRouter } from "./modules/intervu/routes";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";

const app = express();
app.set("trust proxy", true);
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));
app.use(bodyParser.json());

const server = new ApolloServer({ typeDefs, resolvers });
await server.start();

const apiKey = env.apiKey;
app.use("/graphql", bodyParser.json(), (req, res, next) => {
  if (apiKey && req.header("x-api-key") !== apiKey) return res.status(401).end();
  next();
}, expressMiddleware(server, { context: async () => ({}) }));

app.use("/api/portfolio", portfolioRouter);
app.use("/api/intervu", intervuRouter);

export function startHttpServer() {
  return new Promise<void>(resolve => {
    app.listen(env.port, () => resolve());
  });
}



