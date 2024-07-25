// "use server";

import { api } from "./trpc/server";

export const fetchCurrentReads = () => {
  return api.auth.currentReads.query({ limit: 3 });
};

export const fetchRecommendations = () => {
  return api.story.recommendations.query({ limit: 6 });
};

export const fetchFeaturedStories = () => {
  return api.story.featuredStories.query({ limit: 3 });
};

export const fetchLatestStories = () => {
  return api.story.latestStories.query({ limit: 3 });
};

export const fetchTopPicks = () => {
  return api.story.topPicks.query({ limit: 6 });
};

export const fetchImages = () => {
  return api.helpers.images.query();
};

export const fetchMostLoved = () => {
  return api.story.mostLoved.query({ limit: 6 });
};

export const fetchSimilar = (slug: string) => {
  return api.story.similar.query({ slug, limit: 6 });
};

export const fetchReadingList = (authorId: string) => {
  return api.auth.readingLists.query({ authorId, limit: 6 });
};
