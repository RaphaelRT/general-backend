import { Router } from "express";
import { portfolioPrisma } from "../../db/client";

export const portfolioRouter = Router();

portfolioRouter.post("/project/add", async (req, res) => {
  const { name, description } = req.body ?? {};
  if (!name) return res.status(400).json({ error: "name required" });
  const item = await portfolioPrisma.project.create({ data: { name, description } });
  res.json(item);
});

portfolioRouter.post("/project/remove", async (req, res) => {
  const { id } = req.body ?? {};
  if (!id) return res.status(400).json({ error: "id required" });
  await portfolioPrisma.project.delete({ where: { id } });
  res.json({ ok: true });
});

portfolioRouter.post("/experience/add", async (req, res) => {
  const { name, description } = req.body ?? {};
  if (!name) return res.status(400).json({ error: "name required" });
  const item = await portfolioPrisma.experience.create({ data: { name, description } });
  res.json(item);
});


