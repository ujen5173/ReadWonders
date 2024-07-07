export const TCardSelect = {
  id: true,
  description: true,
  slug: true,
  title: true,
  thumbnail: true,
  love: true,
  tags: true,
  isPremium: true,
  categoryName: true,
  readingTime: true,
  isMature: true,
  reads: true,
  chapters: {
    where: {
      published: true,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
    },
  },
  author: {
    select: {
      name: true,
      username: true,
      profile: true,
    },
  },
};
