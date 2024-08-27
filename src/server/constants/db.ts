export const TCardSelect = (userId: string | undefined) => ({
  id: true,
  description: true,
  slug: true,
  title: true,
  thumbnail: true,
  love: true,
  tags: true,
  categoryName: true,
  readingTime: true,
  isMature: true,
  reads: true,
  readingLists: userId
    ? {
        where: {
          authorId: userId,
        },
        select: {
          id: true,
        },
      }
    : false,
  chapters: {
    where: {
      published: true,
    },
    select: {
      id: true,
      title: true,
      isPremium: true,
      sn: true,
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
