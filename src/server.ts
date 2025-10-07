import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolvers";

const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));
app.use(bodyParser.json());

app.get("/healthz", (_req, res) => {
  res.status(200).send("ok");
});

export async function startHttpServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  app.use("/graphql", bodyParser.json(), expressMiddleware(server, { context: async () => ({}) }));
  app.use("/api/graphql", bodyParser.json(), expressMiddleware(server, { context: async () => ({}) }));
  return new Promise<void>(resolve => {
    app.listen(env.port, () => resolve());
  });
}



