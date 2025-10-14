import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import crypto from "node:crypto";

export function requireApiAuth(req: Request, res: Response, next: NextFunction) {
  if (req.method === "OPTIONS") return next();
  if (req.method === "GET" && req.path === "/healthz") return next();

  if (env.nodeEnv === "production") {
    if (env.apiTokens.length === 0) {
      return res.status(500).json({ error: "server misconfigured" });
    }
    const header = req.headers["authorization"] as string | undefined;
    const provided = header?.startsWith("Bearer ") ? header.slice(7) : "";
    const pBuf = Buffer.from(provided);
    const ok = env.apiTokens.some(t => {
      const tBuf = Buffer.from(t);
      return pBuf.length === tBuf.length && crypto.timingSafeEqual(pBuf, tBuf);
    });
    if (!ok) return res.status(401).json({ error: "unauthorized" });
    return next();
  }

  if (env.apiTokens.length > 0) {
    const header = req.headers["authorization"] as string | undefined;
    const provided = header?.startsWith("Bearer ") ? header.slice(7) : "";
    const pBuf = Buffer.from(provided);
    const ok = env.apiTokens.some(t => {
      const tBuf = Buffer.from(t);
      return pBuf.length === tBuf.length && crypto.timingSafeEqual(pBuf, tBuf);
    });
    if (!ok) return res.status(401).json({ error: "unauthorized" });
  }
  return next();
}


