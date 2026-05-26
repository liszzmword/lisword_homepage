import type { MetadataRoute } from "next";
import { PORTFOLIO } from "@/content/portfolio";

const SITE_URL = "https://lisword.co.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/programs",
    "/programs/ai-bootcamp",
    "/programs/skill-training",
    "/programs/skill-training/ai-literacy",
    "/programs/skill-training/data-literacy",
    "/programs/skill-training/rag-development",
    "/programs/skill-training/vibe-coding",
    "/cases",
    "/about",
    "/contact",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const caseRoutes = PORTFOLIO.map((p) => ({
    url: `${SITE_URL}/cases/${p.id}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...caseRoutes];
}
