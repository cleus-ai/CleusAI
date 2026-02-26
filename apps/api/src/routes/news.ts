import { Router } from "express";
import { getNews } from "../services/news.service";

export const newsRouter = Router();
newsRouter.get("/", async (req, res, next) => {
  try {
    const { category, page } = req.query;
    const articles = await getNews({ category: category as string, page: Number(page) || 1 });
    res.json({ articles });
  } catch (e) { next(e); }
});
