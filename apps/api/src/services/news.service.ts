import axios from "axios";
import type { NewsArticle } from "@cleus/shared";

interface GetNewsParams { category?: string; page?: number; }

export async function getNews({ category = "general", page = 1 }: GetNewsParams): Promise<NewsArticle[]> {
  const res = await axios.get("https://newsapi.org/v2/top-headlines", {
    params: { category, page, pageSize: 20, language: "en", apiKey: process.env.NEWS_API_KEY },
  });
  return res.data.articles.map((a: any, i: number) => ({
    id: `${a.source.id ?? "unknown"}-${i}`,
    title: a.title,
    summary: a.description ?? "",
    url: a.url,
    source: a.source.name,
    publishedAt: a.publishedAt,
    imageUrl: a.urlToImage,
    category,
  }));
}
