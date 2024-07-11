export const TCardSelect = (userId: string | undefined) => ({
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
  readingLists: {
    where: {
      authorId: userId || "",
    },
    select: {
      id: true,
    },
  },
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
});
