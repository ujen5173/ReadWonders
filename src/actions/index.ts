// "use server";

import { api } from "~/trpc/server";

export const fetchCurrentReads = () => {
  return api.auth.currentReads({ limit: 3 });
};

export const fetchRecommendations = () => {
  return api.story.recommendations({ limit: 6 });
};

export const fetchFeaturedStories = () => {
  return api.story.featuredStories({ limit: 3 });
};

export const fetchLatestStories = () => {
  return api.story.latestStories({ limit: 3 });
};

export const fetchTopPicks = () => {
  return api.story.topPicks({ limit: 6 });
};

export const fetchImages = () => {
  return api.helpers.images();
};

export const fetchMostLoved = () => {
  return api.story.mostLoved({ limit: 6 });
};

export const fetchSimilar = (slug: string) => {
  return api.story.similar({ slug, limit: 6 });
};

export const fetchReadingList = (authorId: string) => {
  return api.auth.readingLists({ authorId, limit: 6 });
};
