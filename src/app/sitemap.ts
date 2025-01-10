import { type MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://readwonders.vercel.app",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://readwonders.vercel.app/genre",
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.8,
    },
    {
      url: "https://readwonders.vercel.app/auth/login",
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.9,
    },
    {
      url: "https://readwonders.vercel.app/write",
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0.7,
    },
  ];
}
