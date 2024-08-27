export const heroImagesFallback = Array(12)
  .fill(0)
  .map((_, i) => ({
    title: null,
    slug: null,
    thumbnail: `/hero-stories/${Math.floor(Math.random() * 7) + 1}.jpg`,
  }));
