import { Counter, Histogram, Registry, collectDefaultMetrics } from "prom-client";

type QueryKey = string;

type QueryAggregate = {
  sampleSql: string;
  count: number;
  totalDurationMs: number;
};

const registry = new Registry();
collectDefaultMetrics({ register: registry });

const queryCounter = new Counter({
  name: "prisma_queries_total",
  help: "Total des requêtes Prisma",
  labelNames: ["client", "operation"],
  registers: [registry]
});

const queryDuration = new Histogram({
  name: "prisma_query_duration_seconds",
  help: "Durée des requêtes Prisma en secondes",
  labelNames: ["client", "operation"],
  buckets: [0.001,0.005,0.01,0.02,0.05,0.1,0.2,0.5,1,2,5],
  registers: [registry]
});

const topQueries = new Map<QueryKey, QueryAggregate>();

function normalizeOperation(sql: string): string {
  const op = sql.trim().split(/\s+/)[0]?.toLowerCase();
  if (!op) return "unknown";
  return ["select","insert","update","delete"].includes(op) ? op : "other";
}

function keyFromSql(sql: string): string {
  return sql.replace(/\s+/g, " ").trim().slice(0, 2000);
}

export function instrumentPrismaClient(prisma: any, clientName: string) {
  if (!prisma || typeof prisma.$on !== "function") return;
  prisma.$on("query", (e: { query: string; duration: number }) => {
    const operation = normalizeOperation(e.query);
    queryCounter.labels({ client: clientName, operation }).inc();
    queryDuration.labels({ client: clientName, operation }).observe(e.duration / 1000);

    const key = keyFromSql(e.query);
    const agg = topQueries.get(key) ?? { sampleSql: key, count: 0, totalDurationMs: 0 };
    agg.count += 1;
    agg.totalDurationMs += e.duration;
    topQueries.set(key, agg);
  });
}

export function getTopQueries(limit = 20) {
  const arr = Array.from(topQueries.entries()).map(([key, v]) => ({
    sql: v.sampleSql,
    count: v.count,
    totalMs: v.totalDurationMs,
    avgMs: v.totalDurationMs / Math.max(1, v.count)
  }));
  arr.sort((a, b) => b.count - a.count || b.avgMs - a.avgMs);
  return arr.slice(0, limit);
}

export async function getMetricsText() {
  return registry.metrics();
}

export { registry };


