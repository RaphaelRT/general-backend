import { Router } from "express";
import { intervuPrisma } from "../../db/client";

export const intervuRouter = Router();

intervuRouter.post("/questions/add", async (req, res) => {
  const { name, description } = req.body ?? {};
  if (!name) return res.status(400).json({ error: "name required" });
  const q = await intervuPrisma.question.create({ data: { title: name, categoryId: null } });
  res.json(q);
});


