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
import { requireApiAuth } from "./middleware/auth";

const app = express();
app.set("trust proxy", 1);
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: { defaultSrc: ["'self'"] }
  },
  referrerPolicy: { policy: "no-referrer" },
  crossOriginResourcePolicy: { policy: "same-site" },
  strictTransportSecurity: { maxAge: 15552000, includeSubDomains: true, preload: true }
}));

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (env.allowedOrigins.length === 0) return cb(null, true);
    return env.allowedOrigins.includes(origin) ? cb(null, true) : cb(new Error("CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(rateLimit({ windowMs: 60_000, max: 60 }));
app.use(bodyParser.json({ limit: "1mb" }));

app.get("/healthz", (_req, res) => {
  res.status(200).send("ok");
});

app.use(requireApiAuth);

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
  const limit = Math.max(1, Math.min(100, Number(req.query.limit ?? 20)));
  res.json({ items: getTopQueries(limit) });
});

export async function startHttpServer() {
  type GraphQLContext = {};
  const server = new ApolloServer<GraphQLContext>({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    introspection: env.nodeEnv !== "production"
  });
  await server.start();
  app.use(
    "/graphql",
    bodyParser.json({ limit: "1mb" }),
    expressMiddleware<GraphQLContext>(server, { context: async () => ({}) })
  );
  app.use(
    "/api/graphql",
    bodyParser.json({ limit: "1mb" }),
    expressMiddleware<GraphQLContext>(server, { context: async () => ({}) })
  );
  return new Promise<void>(resolve => {
    app.listen(env.port, () => resolve());
  });
}



