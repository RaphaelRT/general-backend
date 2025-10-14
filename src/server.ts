import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import { typeDefs, resolvers } from "./graphql";
import { getMetricsText, getTopQueries } from "./metrics/monitor";

const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));
app.use(bodyParser.json());

app.get("/healthz", (_req, res) => {
  res.status(200).send("ok");
});

app.get("/metrics", async (_req, res) => {
  try {
    const text = await getMetricsText();
    res.setHeader("Content-Type", "text/plain; version=0.0.4; charset=utf-8");
    res.status(200).send(text);
  } catch (e) {
    res.status(500).send("metrics error");
  }
});

app.get("/admin/top-queries", (req, res) => {
  const token = process.env.ADMIN_TOKEN;
  if (token) {
    const header = req.headers["authorization"] as string | undefined;
    if (!header || !header.startsWith("Bearer ") || header.slice(7) !== token) {
      return res.status(401).json({ error: "unauthorized" });
    }
  }
  const limit = Math.max(1, Math.min(100, Number(req.query.limit ?? 20)));
  res.json({ items: getTopQueries(limit) });
});

export async function startHttpServer() {
  type GraphQLContext = {};
  const server = new ApolloServer<GraphQLContext>({ typeDefs, resolvers });
  await server.start();
  app.use(
    "/graphql",
    bodyParser.json(),
    expressMiddleware<GraphQLContext>(server, { context: async () => ({}) })
  );
  app.use(
    "/api/graphql",
    bodyParser.json(),
    expressMiddleware<GraphQLContext>(server, { context: async () => ({}) })
  );
  return new Promise<void>(resolve => {
    app.listen(env.port, () => resolve());
  });
}



